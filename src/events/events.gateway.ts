import {
  ConnectedSocket,
  MessageBody,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  WsResponse,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Game } from 'src/common/Game';
import { GameSettings } from '../common/game.types';
import { ICell, newGameRes } from './events.types';

const port = process.env.PORT || 9090;
@WebSocketGateway(Number(port), {
  transports: ['websocket'],
  cors: {
    origin: '*',
  },
})
export class EventsGateway implements OnGatewayDisconnect {
  @WebSocketServer() server: Server;
  games: Map<string, Game> = new Map();
  clients: Map<string, string> = new Map();

  handleDisconnect(client: any) {
    console.log('client disconnected', client.id);
    const gameId = this.clients.get(client.id);
    this.games.delete(gameId);
    this.clients.delete(client.id);

    console.log(this.games);
  }

  @SubscribeMessage('newGame')
  async newGame(
    @MessageBody() settings: GameSettings,
    @ConnectedSocket() client: any,
  ) {
    console.log('newGame:', settings);
    console.log('client=', client.id);

    const currentGameId = this.clients.get(client.id);
    this.games.delete(currentGameId);

    const game = new Game(settings);

    this.games.set(game.getId(), game);
    this.clients.set(client.id, game.getId());

    // console.log(this.games);
    // console.log(this.clients);

    this.server.emit('newGameRes', {
      id: game.getId(),
      gameState: game.getState(),
      countMines: game.getCountMines(),
    } as newGameRes);
  }

  @SubscribeMessage('cellClick')
  async cellClick(
    @MessageBody() body: { gameId: string; cell: ICell },
    @ConnectedSocket() client: any,
  ) {
    console.log(body);

    const game = this.games.get(body.gameId);
    if (!game) {
      return this.emitErrorGameNotFound(body.gameId);
    }

    const fieldUpdate = JSON.stringify(game.openCell(body.cell));

    this.server.emit('cellClickRes', {
      gameState: game.getState(),
      fieldUpdate,
    });
  }

  protected emitErrorGameNotFound(gameId: string): void {
    this.server.emit('error', {
      message: `GameId ${gameId} not found`,
      code: 'invalid_game_id',
    });
  }

  @SubscribeMessage('cellMark')
  async cellMark(@MessageBody() data: { row: number; cell: number }) {
    console.log(data);
    this.server.emit('cellMarkRes', 1); // 0
  }

  // @SubscribeMessage('message')
  // async identity(@MessageBody() data: any): Promise<any> {
  //   console.log('message', data);
  //   this.server.emit('message', data);
  //   return 'resp:' + data;
  // }
}
