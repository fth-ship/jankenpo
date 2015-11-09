if (Meteor.isClient) {
  angular
    .module('jankenpo', ['angular-meteor', 'ionic'])
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
    .value('visualElements', {
      win: '<img ng-src="imgs/win.png" class="result-img-adjusment">',
      paperWin: '<img ng-src="imgs/paper-win.png" class="result-img-adjusment">',
      scissorsWin: '<img ng-src="imgs/scissors-win.png" class="result-img-adjusment">',
      rockWin: '<img ng-src="imgs/rock-win.png" class="result-img-adjusment">',

    })
    .value('rock', 'pedra')
    .value('paper', 'papel')
    .value('scissors', 'tesoura')
    .controller('MainCtrl', [
      '$log', '$scope',
      '$ionicPopup', 'nextElements',
      'randomReverse', 'machineChoice',
      'visualElements', 'rock',
      'paper', 'scissors', (
        $log, $scope,
        $ionicPopup, nextElements,
        randomReverse, machineChoice,
        visualElements, rock,
        paper, scissors
      ) => {
      $log.debug('O controller principal esta funcionando!');
      // scope shared vars
      $scope.rounds = 0;
      $scope.wins = 0;
      $scope.draws = 0;
      $scope.losses = 0;
      $scope.yourChoices = [];
      // local vars
      var showAlert = (obj) => $ionicPopup.alert(obj);
      var isDraw = (elements, element, choice) => element === elements[choice];
      var rockLoss = (elements, element, choice) => element === rock && (elements[choice] === paper);
      var rockWin = (elements, element, choice) => element === rock && (elements[choice] === scissors);
      var paperLoss = (elements, element, choice) => element === paper && (elements[choice] === scissors);
      var paperWin = (elements, element, choice) => element === paper && (elements[choice] === rock);
      var scissorsLoss = (elements, element, choice) => element === scissors && (elements[choice] === rock);
      var scissorsWin = (elements, element, choice) => element === scissors && (elements[choice] === paper);
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
        } else if (rockLoss(elements, element, machineChoose)) {
          showAlert({
            title: 'Você perdeu',
            template: visualElements.paperWin,
          });
          $scope.losses += 1;
        } else if (rockWin(elements, element, machineChoose)) {
          showAlert({
            title: 'Você ganhou',
            template: visualElements.win,
          });
          $scope.wins += 1;
        } else if (paperLoss(elements, element, machineChoose)) {
          showAlert({
            title: 'Você perdeu',
            template: visualElements.scissorsWin,
          });
          $scope.losses += 1;
        } else if (paperWin(elements, element, machineChoose)) {
          showAlert({
            title: 'Você ganhou',
            template: visualElements.win,
          });
          $scope.wins += 1;
        } else if (scissorsLoss(elements, element, machineChoose)) {
          showAlert({
            title: 'Você perdeu',
            template: visualElements.rockWin,
          });
          $scope.losses += 1;
        } else if (scissorsWin(elements, element, machineChoose)) {
          showAlert({
            title: 'Você ganhou',
            template: visualElements.win,
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
  }

  else {
    angular.element(document).ready(onReady);
  }
}

if (Meteor.isServer) {
  Meteor.startup(() => console.log('O Servidor do Jankenpo esta funcionando!'));
}

function onReady() {
  angular.bootstrap(document, ['jankenpo']);
}
