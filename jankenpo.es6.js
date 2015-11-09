if (Meteor.isClient) {
  angular
    .module('jankenpo', ['angular-meteor', 'ionic'])
    .factory('nextElements', ['$log', ($log) => {
      return (elements, element) => {
        $log.debug('next elements ' + elements + ' with ' + element);
        var randomPosition = Math.max(0, Math.round(Math.random() * 1));
        if (element === 'pedra' && (randomPosition)) {
          elements.push('tesoura');
          elements.push('papel');
        } else if (element === 'pedra' && (!randomPosition)) {
          elements.push('papel');
          elements.push('tesoura');
        } else if (element === 'papel' && (randomPosition)) {
          elements.push('tesoura');
          elements.push('pedra');
        } else if (element === 'papel' && (!randomPosition)) {
          elements.push('tesoura');
          elements.push('pedra');
        } else if (element === 'tesoura' && (randomPosition)) {
          elements.push('pedra');
          elements.push('papel');
        } else if (element === 'tesoura' && (!randomPosition)) {
          elements.push('papel');
          elements.push('pedra');
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
    .controller('MainCtrl', [
      '$log', '$scope',
      '$ionicPopup', 'nextElements',
      'randomReverse', 'machineChoice',
      'visualElements', (
        $log, $scope,
        $ionicPopup, nextElements,
        randomReverse, machineChoice,
        visualElements
      ) => {
      $log.debug('O controller principal esta funcionando!');
      // scope shared vars
      $scope.rounds = 0;
      $scope.wins = 0;
      $scope.draws = 0;
      $scope.losses = 0;
      // local vars
      var showAlert = (obj) => $ionicPopup.alert(obj);
      var isDraw = (elements, element, choice) => element === elements[choice];
      var rockLoss = (elements, element, choice) => element === 'pedra' && (elements[choice] === 'papel');
      var rockWin = (elements, element, choice) => element === 'pedra' && (elements[choice] === 'tesoura');
      var paperLoss = (elements, element, choice) => element === 'papel' && (elements[choice] === 'tesoura');
      var paperWin = (elements, element, choice) => element === 'papel' && (elements[choice] === 'pedra');
      var scissorsLoss = (elements, element, choice) => element === 'tesoura' && (elements[choice] === 'pedra');
      var scissorsWin = (elements, element, choice) => element === 'tesoura' && (elements[choice] === 'papel');
      // scope shared functions
      $scope.onChoose = (element) => {
        $log.debug('on choose ' + element);
        var elements = [element];
        elements = nextElements(elements, element);
        elemensts = randomReverse(elements);
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
