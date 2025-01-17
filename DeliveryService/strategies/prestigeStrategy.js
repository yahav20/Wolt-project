class PrestigeStrategy {
    assign(personnel, order) {
      return personnel
        .filter(person => person.available)
        .sort((a, b) => a.speed - b.speed)[0]; // Sort by the fastest
    }
  }
  
  module.exports = PrestigeStrategy;
  