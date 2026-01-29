import 'dotenv/config';
import { DynamicModule, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SessionsController } from './sessions/controllers/session.controller';
import { SessionsService } from './sessions/services/session.service';
import { ConversationEvent, ConversationEventSchema } from './sessions/schemas/conversation-event.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { ConversationSession, ConversationSessionSchema } from './sessions/schemas/conversation-session.schema';
import { SessionsModule } from './sessions/module/sessions.module';

class ConnectionModule {
  static forRoot(): DynamicModule {
    const root = MongooseModule.forRoot(process.env.MONGO_HOST || '');

    const feature = MongooseModule.forFeature([
      { name: ConversationSession.name, schema: ConversationSessionSchema },
      { name: ConversationEvent.name, schema: ConversationEventSchema },
    ]);
    return {
      module: ConnectionModule,
      global: true,
      imports: [root, feature],
      exports: [root, feature],
    };
  }
}

@Module({
  imports: [
    ConnectionModule.forRoot(),
    SessionsModule
  ],
  controllers: [
    AppController,
    SessionsController
  ],
  providers: [
    AppService,
    SessionsService
  ],
})

export class AppModule { }