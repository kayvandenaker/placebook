class Memory {
  constructor( id, date, info, loc, due ) {
    // string
    this.id = id;
    this.date = date;
    this.info = info;
    this.loc = loc;
    // boolean
    if ( due == 'True') {
      this.due = true;
    } else {
      this.due = false;
    }
  }
}
