import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ConversationSession } from './conversation-session.schema';

export enum ConversationEventType {
  USER_SPEECH = 'user_speech',
  BOT_SPEECH = 'bot_speech',
  SYSTEM = 'system',
}

export interface IConversationEvent {
  eventId: string;
  type: ConversationEventType | null;
  payload?: Record<string, any>;
  timestamp: Date;
}

@Schema({ timestamps: true })
export class ConversationEvent implements IConversationEvent {

  @Prop({ required: true })
  eventId: string;

  @Prop({ type: String, required: true, ref: ConversationSession.name })
  sessionId: string;

  @Prop({ type: String, enum: ConversationEventType, default: null })
  type: ConversationEventType | null;

  @Prop({ type: Object })
  payload: Record<string, any>;

  @Prop({ type: Date, default: () => new Date() })
  timestamp: Date;
}

export const ConversationEventSchema = SchemaFactory.createForClass(ConversationEvent);