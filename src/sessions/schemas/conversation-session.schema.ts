import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export enum SessionStatus {
  INITIATED = 'initiated',
  ACTIVE = 'active',
  COMPLETED = 'completed',
  FAILED = 'failed',
}

export interface IConversationSession {
  sessionId: string;
  status: SessionStatus | null;
  language: string;
  startedAt: Date;
  endedAt?: Date | null;
  metadata?: Record<string, any>;
}

@Schema({ timestamps: true })
export class ConversationSession implements IConversationSession {

  @Prop({ unique: true })
  sessionId: string;

  @Prop({ type: String, enum: SessionStatus, default: null })
  status: SessionStatus | null;

  @Prop({ required: true })
  language: string;

  @Prop({ type: Date, required: true })
  startedAt: Date;

  @Prop({ type: Date, default: null })
  endedAt: Date | null;

  @Prop({ type: Object, default: {} })
  metadata: Record<string, any>;

}

export const ConversationSessionSchema = SchemaFactory.createForClass(ConversationSession);