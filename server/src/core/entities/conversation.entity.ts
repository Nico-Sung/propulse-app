export class Conversation {
  private readonly _id: string;
  private readonly _participantIds: string[];
  private readonly _createdAt: Date;
  private _lastMessageAt: Date;

  constructor(
    id: string,
    participantIds: string[],
    createdAt: Date,
    lastMessageAt: Date,
  ) {
    this._id = id;
    this._participantIds = participantIds;
    this._createdAt = createdAt;
    this._lastMessageAt = lastMessageAt;

    this.validate();
  }

  get id(): string {
    return this._id;
  }

  get participantIds(): string[] {
    return [...this._participantIds];
  }

  get createdAt(): Date {
    return this._createdAt;
  }

  get lastMessageAt(): Date {
    return this._lastMessageAt;
  }

  private validate(): void {
    if (!this._participantIds || this._participantIds.length < 2) {
      throw new Error('Une conversation doit avoir au moins 2 participants.');
    }
  }

  public hasParticipant(userId: string): boolean {
    return this._participantIds.includes(userId);
  }

  public updateLastActivity(): void {
    this._lastMessageAt = new Date();
  }
}
