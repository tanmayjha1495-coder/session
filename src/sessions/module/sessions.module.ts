import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConversationSession } from '../schemas/conversation-session.schema';
import { ConversationEvent, ConversationEventSchema } from '../schemas/conversation-event.schema';
import { SessionsController } from '../controllers/session.controller';
import { SessionsService } from '../services/session.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: ConversationSession.name, schema: ConversationSession },
      { name: ConversationEvent.name, schema: ConversationEventSchema },
    ]),
  ],
  controllers: [SessionsController],
  providers: [SessionsService],
})

export class SessionsModule {}