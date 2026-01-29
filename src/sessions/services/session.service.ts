import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ConversationSession, IConversationSession, SessionStatus } from '../schemas/conversation-session.schema';
import { ConversationEvent, IConversationEvent } from '../schemas/conversation-event.schema';
import { ConversationResponseDto, CreateConversationEventDto, CreateConversationSessionDto } from '../dto/session.dto';


@Injectable()
export class SessionsService {
  constructor(
    @InjectModel(ConversationSession.name)
    private readonly sessionModel: Model<ConversationSession>,
    @InjectModel(ConversationEvent.name)
    private readonly eventModel: Model<ConversationEvent>,
  ) { }


  // create session with upsert
  async createSession(data: CreateConversationSessionDto): Promise<ConversationResponseDto> {
    const res = new ConversationResponseDto();
    try {
      const doc: IConversationSession = {
        sessionId: data.sessionId,
        status: data.status as SessionStatus,
        language: data.language,
        startedAt: data?.startedAt ?? new Date(),
        endedAt: data?.endedAt,
      }

      const sessionDoc = await this.sessionModel.findOneAndUpdate(
        { sessionId: data.sessionId },
        { $set: { ...doc } },
        { upsert: true, new: true },
      );
      res.status = true;
      res.message = 'Session created successfully';
      res.response = sessionDoc;

    } catch (error) {
      console.error('Error in upsertSession:', error);
      res.status = false;
      res.message = 'Failed to create session';
      res.error = error;
    }
    return res;
  }


  // get session along with its events
  async getSession(
    sessionId: string,
    limit: number,
    offset: number
  ): Promise<ConversationResponseDto> {
    const res = new ConversationResponseDto();
    try {
      const session = await this.sessionModel.findOne({ sessionId }).select('-__v');
      if (!session) {
        res.status = false;
        res.message = 'Session not found';
        return res;
      }
      const events = await this.eventModel
        .find({ sessionId })
        .select('-__v')
        .sort({ timestamp: 1 })
        .skip(offset)
        .limit(limit);
      if (!events || events.length === 0) {
        res.status = true;
        res.message = 'No events found for this session';
        res.response = { session, events: [] };
        return res;
      }
      res.status = true;
      res.response = { session, events: events };
      res.message = 'Session fetched successfully';

    } catch (error) {
      console.error('Error in getSession:', error);
      res.status = false;
      res.message = 'Failed to fetch session';
      res.error = error;
    }
    return res;
  }


  // add event to session
  async addEvent(
    sessionId: string,
    data: CreateConversationEventDto,
  ): Promise<ConversationResponseDto> {
    const res = new ConversationResponseDto();
    try {
      const session = await this.sessionModel.findOne({ sessionId });
      if (!session) {
        res.status = false;
        res.message = 'Session not found';
        return res;
      }

      const eventDoc: IConversationEvent = {
        eventId: data.eventId,
        type: data.type ?? null,
        payload: data.payload,
        timestamp: new Date(),
      };

      const event = await this.eventModel.findOneAndUpdate(
        { sessionId, eventId: data.eventId },
        { $setOnInsert: eventDoc },
        { upsert: true, new: true }
      );

      res.status = true;
      res.message = 'Event added successfully';
      res.response = event;

    } catch (error) {
      console.error('Error in addEvent:', error);
      res.status = false;
      res.message = 'Failed to add event';
      res.error = error;
    }

    return res;
  }
  // complete a session
  async completeSession(sessionId: string): Promise<ConversationResponseDto> {
    const res = new ConversationResponseDto();
    try {
      const session = await this.sessionModel.findOneAndUpdate(
        { sessionId },
        { status: 'completed', endedAt: new Date() },
        { new: true },
      );
      if (!session) {
        res.status = false;
        res.message = 'Session not found';
        return res;
      }
      res.status = true;
      res.message = 'Session completed successfully';
      res.response = session;
    } catch (error) {
      console.error('Error in completeSession:', error);
      res.status = false;
      res.message = 'Failed to complete session';
      res.error = error;
    }
    return res;
  }
}
