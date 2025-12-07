export class Message {
  constructor(
    private readonly _id: string,
    private readonly _content: string,
    private readonly _senderId: string,
    private readonly _conversationId: string,
    private readonly _createdAt: Date,
  ) {
    this.validate();
  }

  get id(): string {
    return this._id;
  }
  get content(): string {
    return this._content;
  }
  get senderId(): string {
    return this._senderId;
  }
  get conversationId(): string {
    return this._conversationId;
  }
  get createdAt(): Date {
    return this._createdAt;
  }

  private validate(): void {
    if (!this._content || this._content.trim().length === 0) {
      throw new Error('Le message ne peut pas être vide.');
    }
  }

  toJSON() {
    return {
      id: this.id,
      content: this.content,
      senderId: this.senderId,
      conversationId: this.conversationId,
      createdAt: this.createdAt,
    };
  }
}
