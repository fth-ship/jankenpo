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
    .controller('MainCtrl', [
      '$log', '$scope',
      '$ionicPopup', 'nextElements',
      'randomReverse', 'machineChoice', (
        $log, $scope,
        $ionicPopup, nextElements,
        randomReverse, machineChoice
      ) => {
      $log.debug('O controller principal esta funcionando!');
      $scope.wins = 0;
      $scope.draws = 0;
      $scope.losses = 0;

      $scope.onChoose = (element) => {
        $log.debug('on choose ' + element);
        var elements = [element];
        elements = nextElements(elements, element);
        elemensts = randomReverse(elements);
        $log.debug(elements);
        var machineChoose = machineChoice();
        $log.debug('machineChoose value ' + machineChoose);
        $log.debug('Escolha da máquina: ' + elements[machineChoose]);

        if (element === elements[machineChoose]) {
          $ionicPopup.alert({
            title: 'Empate',
            template: 'Mesmo elemento escolhido!',
          });
          $scope.draws += 1;
        } else if (element === 'pedra' && (elements[machineChoose] === 'papel')) {
          $ionicPopup.alert({
            title: 'Você perdeu',
            template: '<img ng-src="imgs/paper-win.png" class="result-img-adjusment">',
          });
          $scope.losses += 1;
        } else if (element === 'pedra' && (elements[machineChoose] === 'tesoura')) {
          $ionicPopup.alert({
            title: 'Você ganhou',
            template: '<img ng-src="imgs/win.png" class="result-img-adjusment">',
          });
          $scope.wins += 1;
        } else if (element === 'papel' && (elements[machineChoose] === 'tesoura')) {
          $ionicPopup.alert({
            title: 'Você perdeu',
            template: '<img ng-src="imgs/scissors-win.png" class="result-img-adjusment">',
          });
          $scope.losses += 1;
        } else if (element === 'papel' && (elements[machineChoose] === 'pedra')) {
          $ionicPopup.alert({
            title: 'Você ganhou',
            template: '<img ng-src="imgs/win.png" class="result-img-adjusment">',
          });
          $scope.wins += 1;
        } else if (element === 'tesoura' && (elements[machineChoose] === 'pedra')) {
          $ionicPopup.alert({
            title: 'Você perdeu',
            template: '<img ng-src="imgs/rock-win.png" class="result-img-adjusment">',
          });
          $scope.losses += 1;
        } else if (element === 'tesoura' && (elements[machineChoose] === 'papel')) {
          $ionicPopup.alert({
            title: 'Você ganhou',
            template: '<img ng-src="imgs/win.png" class="result-img-adjusment">',
          });
          $scope.wins += 1;
        } else {
          $ionicPopup.alert({
            title: 'Regra sem cobertura',
            template: 'Regra sem cobertura'
          });
          $scope.losses += 1;
        }
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
