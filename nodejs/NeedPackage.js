module.exports = {
  // Create a NeedPackage
  create: function __create() {
    'use strict';
    return {
      id: 170771,
      userId: 'Edward',
      need: 'car_rental_offer',
      solutions: []
    };
  },

  // Add a solution to an existing NeedPackage
  addSolution: function __addSolution(thePackage, solution) {
    'use strict';
    // TODO: validate solution?
    thePackage.solutions.push(solution);

    return thePackage;
  }
};
