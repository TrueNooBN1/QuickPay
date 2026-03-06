export class SeatAlreadyBookingException extends Error {
  constructor(seat: number, row: number) {
    super(`Seat ${seat} on row ${row} is already booking`);
    this.name = 'SeatAlreadyBookingException';
  }
}
export class TicketsNotFoundInOrderException extends Error {
  constructor() {
    super(`Tickets not found in order`);
    this.name = 'TicketsNotFoundInOrderException';
  }
}
export class FilmOrSessionNotFoundException extends Error {
  constructor(filmId: string, sessionId: string) {
    super(`Film with ID ${filmId} or session with ID ${sessionId} not found`);
    this.name = 'TicketsNotFoundInOrderException';
  }
}
