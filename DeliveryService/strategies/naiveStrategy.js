class NaiveStrategy {
    assign(personnel) {
      return personnel.find(person => person.available);
    }
  }
  
  module.exports = NaiveStrategy;
  