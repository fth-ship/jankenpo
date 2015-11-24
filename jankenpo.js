if (Meteor.isClient) {
  angular
    .module('jankenpo', ['angular-meteor', 'ionic'])
    .value('visualElements', {
      win: 'imgs/win.png',
      paperWin: 'imgs/paper-win.png',
      scissorsWin: 'imgs/scissors-win.png',
      rockWin: 'imgs/rock-win.png',

    })
    .value('rock', 'pedra')
    .value('paper', 'papel')
    .value('scissors', 'tesoura')
    .factory('nextElements', [
      '$log', 'rock',
      'paper', 'scissors', (
      $log, rock,
      paper, scissors
    ) => {
      return (elements, element) => {
        $log.debug('next elements ' + elements + ' with ' + element);
        var randomPosition = Math.max(0, Math.round(Math.random() * 1));
        if (element === rock && (randomPosition)) {
          elements.push(scissors);
          elements.push(paper);
        } else if (element === rock && (!randomPosition)) {
          elements.push(paper);
          elements.push(scissors);
        } else if (element === paper && (randomPosition)) {
          elements.push(scissors);
          elements.push(rock);
        } else if (element === paper && (!randomPosition)) {
          elements.push(scissors);
          elements.push(rock);
        } else if (element === scissors && (randomPosition)) {
          elements.push(rock);
          elements.push(paper);
        } else if (element === scissors && (!randomPosition)) {
          elements.push(paper);
          elements.push(rock);
        }
        return elements;
      };
    }])
    .factory('randomReverse', ['$log', ($log) => {
      return (elements) => {
        $log.debug('random reverse with ' + elements);
        var isReverse = Math.max(0, Math.round(Math.random() * 1));
        if (isReverse) {
          elements = elements.reverse();
        }
        return elements;
      };
    }])
    .factory('machineChoice', ['$log', ($log) => {
      return () => {
        $log.debug('machine choice');
        return Math.max(0, Math.floor(Math.random() * 3))
      };
    }])
    .factory('showAlert', [
      '$ionicPopup',
      ($ionicPopup) => {
        return (obj) => $ionicPopup.alert(obj);
      }
    ])
    .factory('isDraw', [() => {
      return (elements, element, choice) => element === elements[choice];
    }])
    .factory('isRockLoss', ['rock', 'paper', (rock, paper) => {
      return (elements, element, choice) => element === rock && (elements[choice] === paper);
    }])
    .factory('isRockWin', ['rock', 'scissors', (rock, scissors) => {
      return (elements, element, choice) => element === rock && (elements[choice] === scissors);
    }])
    .factory('isPaperLoss', ['paper', 'scissors', (paper, scissors) => {
      return (elements, element, choice) => element === paper && (elements[choice] === scissors);
    }])
    .factory('isPaperWin', ['paper', 'rock', (paper, rock) => {
      return (elements, element, choice) => element === paper && (elements[choice] === rock);
    }])
    .factory('isScissorsLoss', ['scissors', 'rock', (scissors, rock) => {
      return (elements, element, choice) => element === scissors && (elements[choice] === rock);
    }])
    .factory('isScissorsWin', ['scissors', 'paper', (scissors, paper) => {
      return (elements, element, choice) => element === scissors && (elements[choice] === paper);
    }])
    .factory('drawAlert', ['showAlert', (showAlert) => {
      return () => {
        showAlert({
          title: 'Empate',
          template: 'Mesmo elemento escolhido!',
        });
      };
    }])
    .factory('lossAlert', ['showAlert', (showAlert) => {
      return (imagePath) => {
        showAlert({
          title: 'Você perdeu',
          template: '<img ng-src="' + imagePath + '" class="result-img-adjusment">',
        });
      };
    }])
    .factory('winAlert', ['showAlert', (showAlert) => {
      return (imagePath) => {
        showAlert({
          title: 'Você ganhou',
          template: '<img ng-src="' + imagePath + '" class="result-img-adjusment">',
        });
      };
    }])
    .factory('uncoveredAlert', ['showAlert', (showAlert) => {
      return () => {
        showAlert({
          title: 'Regra sem cobertura',
          template: 'Regra sem cobertura'
        });
      };
    }])
    .controller('MainCtrl', [
      '$log', '$scope',
      '$ionicPopup', 'nextElements',
      'randomReverse', 'machineChoice',
      'visualElements', 'isDraw',
      'isRockLoss', 'isRockWin',
      'isPaperLoss', 'isPaperWin',
      'isScissorsLoss', 'isScissorsWin',
      'drawAlert', 'lossAlert',
      'winAlert', 'showAlert', (
        $log, $scope,
        $ionicPopup, nextElements,
        randomReverse, machineChoice,
        visualElements, isDraw,
        isRockLoss, isRockWin,
        isPaperLoss, isPaperWin,
        isScissorsLoss, isScissorsWin,
        drawAlert, lossAlert,
        winAlert, showAlert
      ) => {
      $log.debug('O controller principal esta funcionando!');
      // scope shared vars
      $scope.rounds = 0;
      $scope.wins = 0;
      $scope.draws = 0;
      $scope.losses = 0;
      $scope.yourChoices = [];
      // scope shared functions
      $scope.onChoose = (element) => {
        $log.debug('on choose ' + element);
        var elements = [element];
        elements = nextElements(elements, element);
        elements = randomReverse(elements);
        $log.debug(elements);
        var machineChoose = machineChoice();
        $log.debug('machineChoose value ' + machineChoose);
        $log.debug('Escolha da máquina: ' + elements[machineChoose]);

        if (isDraw(elements, element, machineChoose)) {
          drawAlert();
          $scope.draws += 1;
        } else if (isRockLoss(elements, element, machineChoose)) {
          lossAlert(visualElements.paperWin);
          $scope.losses += 1;
        } else if (isRockWin(elements, element, machineChoose)) {
          winAlert(visualElements.win);
          $scope.wins += 1;
        } else if (isPaperLoss(elements, element, machineChoose)) {
          lossAlert(visualElements.scissorsWin);
          $scope.losses += 1;
        } else if (isPaperWin(elements, element, machineChoose)) {
          winAlert(visualElements.win);
          $scope.wins += 1;
        } else if (isScissorsLoss(elements, element, machineChoose)) {
          lossAlert(visualElements.rockWin);
          $scope.losses += 1;
        } else if (isScissorsWin(elements, element, machineChoose)) {
          winAlert(visualElements.win);
          $scope.wins += 1;
        } else {
          uncoveredAlert();
          $scope.losses += 1;
        }

        $scope.rounds += 1;
        $scope.yourChoices.push(element);
      };
    }])
    .run([
      '$log',
      ($log) => $log.debug('O módulo jankenpo esta funcionando!')
    ]);

  if (Meteor.isCordova) {
    angular.element(document).on('deviceready', onReady);
  } else {
    angular.element(document).ready(onReady);
  }
}

if (Meteor.isServer) {
  Meteor.startup(() => console.log('O Servidor do Jankenpo esta funcionando!'));
}

function onReady() {
  angular.bootstrap(document, ['jankenpo']);
}
