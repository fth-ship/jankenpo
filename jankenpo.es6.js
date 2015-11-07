if (Meteor.isClient) {
  angular
    .module('jankenpo', ['angular-meteor', 'ionic'])
    .controller('MainCtrl', [
      '$log', '$scope',
      '$ionicPopup',
      ($log, $scope, $ionicPopup) => {
      $log.debug('O controller principal esta funcionando!');
      $scope.onChoose = (element) => {
        $log.debug('on choose ' + element);
        var nextElements = (element) => {
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
        };
        var elements = [element];
        nextElements(element);
        $log.debug(elements);
        var machineChoice = Math.max(0, Math.floor(Math.random() * 3));

        $log.debug('machineChoice value ' + machineChoice);
        $log.debug('Escolha da máquina: ' + elements[machineChoice]);

        if (element === elements[machineChoice]) {
          $ionicPopup.alert({
            title: 'Empate',
            template: 'Mesmo elemento escolhido!',
          });
        } else if (element === 'pedra' && (elements[machineChoice] === 'papel')) {
          $ionicPopup.alert({
            title: 'Você perdeu',
            template: 'A máquina escolheu papel',
          });
        } else if (element === 'pedra' && (elements[machineChoice] === 'tesoura')) {
          $ionicPopup.alert({
            title: 'Você ganhou',
            template: 'A máquina escolheu tesoura',
          });
        } else if (element === 'papel' && (elements[machineChoice] === 'tesoura')) {
          $ionicPopup.alert({
            title: 'Você perdeu',
            template: 'A máquina escolheu tesoura',
          });
        } else if (element === 'papel' && (elements[machineChoice] === 'pedra')) {
          $ionicPopup.alert({
            title: 'Você ganhou',
            template: 'A máquina escolheu pedra',
          });
        } else if (element === 'tesoura' && (elements[machineChoice] === 'pedra')) {
          $ionicPopup.alert({
            title: 'Você perdeu',
            template: 'A máquina escolheu pedra',
          });
        } else if (element === 'tesoura' && (elements[machineChoice] === 'papel')) {
          $ionicPopup.alert({
            title: 'Você ganhou',
            template: 'A máquina escolheu papel',
          });
        } else {
          $ionicPopup.alert({
            title: 'Regra sem cobertura',
            template: 'Regra sem cobertura'
          });
        }
      };
    }])
    .run([
      '$log',
      ($log) => $log.debug('O módulo jankenpo esta funcionando!')
    ]);
}

if (Meteor.isServer) {
  Meteor.startup(() => console.log('O Servidor do Jankenpo esta funcionando!'));
}
