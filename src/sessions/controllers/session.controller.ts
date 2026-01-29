import { Controller, Post, Get, Param, Body, Query } from '@nestjs/common';
import { SessionsService } from '../services/session.service';
import { CreateConversationSessionDto, CreateConversationEventDto } from '../dto/session.dto';

@Controller()
export class SessionsController {
  constructor(
    private readonly sessionsService: SessionsService
  ) { }

  @Post('/')
  async create(
    @Body() body: CreateConversationSessionDto
  ): Promise<any> {
    try {
      const { sessionId, status, language } = body;
      if (!sessionId || !status || !language) {
        return {
          status: false,
          message: 'Missing required fields',
        }
      }
      else
        return await this.sessionsService.createSession(body);
    } catch (error) {
      console.error('Error in create session controller:', error);
      return {
        status: false,
        message: 'Failed to create session',
        error: error,
      }
    }
  }

  @Get(':sessionId')
  async get(
    @Param('sessionId') sessionId: string,
    @Query('limit') limit = 20,
    @Query('offset') offset = 0
  ) {
    try {
      return await this.sessionsService.getSession(sessionId, +limit, +offset);
    } catch (error) {
      console.error('Error in get session controller:', error);
      return {
        status: false,
        message: 'Failed to get session',
        error: error,
      }
    }
  }

  @Post(':sessionId/events')
  async addEvent(
    @Param('sessionId') sessionId: string,
    @Body() body: CreateConversationEventDto
  ) {
    try {
      const { eventId, type } = body;
      if (!sessionId || !eventId || !type) {
        return {
          status: false,
          message: 'Missing required fields',
        }
      }
      else
        return await this.sessionsService.addEvent(sessionId, body);
    } catch (error) {
      console.error('Error in add event controller:', error);
      return {
        status: false,
        message: 'Failed to add event',
        error: error,
      }
    }
  }

  @Post(':sessionId/complete')
  async complete(
    @Param('sessionId') sessionId: string
  ) {
    try {
      return await this.sessionsService.completeSession(sessionId);
    } catch (error) {
      console.error('Error in complete session controller:', error);
    }
  }
}
