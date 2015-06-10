module.exports = {
  // Create a NeedPackage
  create: function __create() {
    return {
      json_class: "RentalOfferNeed",
      need: 'car_rental_offer',
      solutions: []
    };
  },

  // Add a solution to an existing NeedPackage
  addSolution: function __addSolution(package, solution) {
    // TODO: validate solution?
    package.solutions.push(solution);

    return package;
  }
};
