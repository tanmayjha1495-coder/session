import {
    IsString,
    IsOptional,
    IsEnum,
    IsDate,
    IsObject,
    IsBoolean,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ConversationSession, SessionStatus } from '../schemas/conversation-session.schema';
import { ConversationEventType } from '../schemas/conversation-event.schema';


export class ConversationResponseDto {
    @IsString()
    message: string;

    @IsBoolean()
    status: boolean;

    @IsOptional()
    @IsObject()
    response: any;

    @IsOptional()
    error?: any;
}

export class CreateConversationSessionDto {

    @IsString()
    sessionId: string;

    @IsEnum(SessionStatus)
    status?: SessionStatus | null;

    @IsString()
    language: string;

    @Type(() => Date)
    @IsDate()
    startedAt: Date;

    @IsOptional()
    @Type(() => Date)
    @IsDate()
    endedAt?: Date | null;

    @IsOptional()
    @IsObject()
    metadata?: Record<string, any>;
}


export class CreateConversationEventDto {

    @IsString()
    eventId: string;

    @IsEnum(ConversationEventType)
    type?: ConversationEventType | null;

    @IsOptional()
    @IsObject()
    payload?: Record<string, any>;
}