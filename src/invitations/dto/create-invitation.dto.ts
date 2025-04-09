// src/invitations/dto/create-invitation.dto.ts

import { IsString, IsEmail } from 'class-validator';

export class CreateInvitationDto {
  @IsEmail()
  @IsString()
  userEmail: string;

  @IsString()
  invitedById: string;
}
