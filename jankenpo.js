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
    .controller('MainCtrl', [
      '$log', '$scope',
      '$ionicPopup', 'nextElements',
      'randomReverse', 'machineChoice',
      'visualElements', 'rock',
      'paper', 'scissors',
      'showAlert', (
        $log, $scope,
        $ionicPopup, nextElements,
        randomReverse, machineChoice,
        visualElements, rock,
        paper, scissors,
        showAlert,
      ) => {
      $log.debug('O controller principal esta funcionando!');
      // scope shared vars
      $scope.rounds = 0;
      $scope.wins = 0;
      $scope.draws = 0;
      $scope.losses = 0;
      $scope.yourChoices = [];
      // local vars
      var isDraw = (elements, element, choice) => element === elements[choice];
      var isRockLoss = (elements, element, choice) => element === rock && (elements[choice] === paper);
      var isRockWin = (elements, element, choice) => element === rock && (elements[choice] === scissors);
      var isPaperLoss = (elements, element, choice) => element === paper && (elements[choice] === scissors);
      var isPaperWin = (elements, element, choice) => element === paper && (elements[choice] === rock);
      var isScissorsLoss = (elements, element, choice) => element === scissors && (elements[choice] === rock);
      var isScissorsWin = (elements, element, choice) => element === scissors && (elements[choice] === paper);
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
          showAlert({
            title: 'Empate',
            template: 'Mesmo elemento escolhido!',
          });
          $scope.draws += 1;
        } else if (isRockLoss(elements, element, machineChoose)) {
          showAlert({
            title: 'Você perdeu',
            template: '<img ng-src="' + visualElements.paperWin + '" class="result-img-adjusment">',
          });
          $scope.losses += 1;
        } else if (isRockWin(elements, element, machineChoose)) {
          showAlert({
            title: 'Você ganhou',
            template: '<img ng-src="' + visualElements.win + '" class="result-img-adjusment">',
          });
          $scope.wins += 1;
        } else if (isPaperLoss(elements, element, machineChoose)) {
          showAlert({
            title: 'Você perdeu',
            template: '<img ng-src="' + visualElements.scissorsWin + '" class="result-img-adjusment">',
          });
          $scope.losses += 1;
        } else if (isPaperWin(elements, element, machineChoose)) {
          showAlert({
            title: 'Você ganhou',
            template: '<img ng-src="' + visualElements.win + '" class="result-img-adjusment">',
          });
          $scope.wins += 1;
        } else if (isScissorsLoss(elements, element, machineChoose)) {
          showAlert({
            title: 'Você perdeu',
            template: '<img ng-src="' + visualElements.rockWin + '" class="result-img-adjusment">',
          });
          $scope.losses += 1;
        } else if (isScissorsWin(elements, element, machineChoose)) {
          showAlert({
            title: 'Você ganhou',
            template: '<img ng-src="' + visualElements.rockWin + '" class="result-img-adjusment">',
          });
          $scope.wins += 1;
        } else {
          showAlert({
            title: 'Regra sem cobertura',
            template: 'Regra sem cobertura'
          });
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
