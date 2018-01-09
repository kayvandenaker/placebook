class Memory {
  constructor( id, date, info, loc, due ) {
    // string
    this.id = id;
    this.date = date;
    this.info = info;
    this.loc = loc;
    // boolean in string (ex. "True")
    // caused by django
    this.due = due;
  }
}
