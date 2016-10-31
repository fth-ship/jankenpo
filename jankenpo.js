const ROCK = 'pedra';
const PAPER = 'papel';
const SCISSORS = 'tesoura';
const rock = 'rock';
const paper = 'paper';
const scissors = 'scissors';
const draw = 'Empate';
const loss = 'Você perdeu';
const gain = 'Você ganhou';
const uncovered = 'Regra sem cobertura';
const win = 'win';
const paperWin = 'paperWin';
const scissorsWin = 'scissorsWin';
const rockWin = 'rockWin';
const sameElementMessage = 'Mesmo elemento escolhido!';
const imgs = {
  win: 'imgs/win.png',
  paperWin: 'imgs/paper-win.png',
  scissorsWin: 'imgs/scissors-win.png',
  rockWin: 'imgs/rock-win.png',
};
const resImgTag = imagePath => '<img ng-src="' + imagePath + '" class="result-img-adjusment">';

if (Meteor.isClient) {
  angular
    .module('jankenpo', ['angular-meteor', 'ionic'])
    .value('visualElements', {
      win: imgs[win],
      paperWin: imgs[paperWin],
      scissorsWin: imgs[scissorsWin],
      rockWin: imgs[rockWin],
    })
    .value(rock, ROCK)
    .value(paper, PAPER)
    .value(scissors, SCISSORS)
    .factory('nextElements', [
      '$log', rock,
      paper, scissors, (
      $log, rock,
      paper, scissors
    ) => {
      return (elements, element) => {
        $log.debug('next elements ' + elements + ' with ' + element);
        let randomPosition = Math.max(0, Math.round(Math.random() * 1));
        let isRock = (element === rock);
        let isRockTossed = isRock && (randomPosition);
        let isRockUntossed = isRock && (!randomPosition);
        let isPaper = (element === paper);
        let isPaperTossed = isPaper && (randomPosition);
        let isPaperUntossed = isPaper && (!randomPosition);
        let isScissors = (element === scissors);
        let isScissorsTossed = isScissors && (randomPosition);
        let isScissorsUntossed = isScissors && (!randomPosition);

        if (isRockTossed) {
          elements.push(scissors, paper);
        } else if (isRockUntossed) {
          elements.push(paper, scissors);
        } else if (isPaperTossed) {
          elements.push(scissors, rock);
        } else if (isPaperUntossed) {
          elements.push(scissors, rock);
        } else if (isScissorsTossed) {
          elements.push(rock, paper);
        } else if (isScissorsUntossed) {
          elements.push(paper, rock);
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
    .factory('isRockLoss', [rock, paper, (rock, paper) => {
      return (elements, element, choice) => element === rock && (elements[choice] === paper);
    }])
    .factory('isRockWin', [rock, scissors, (rock, scissors) => {
      return (elements, element, choice) => element === rock && (elements[choice] === scissors);
    }])
    .factory('isPaperLoss', [paper, scissors, (paper, scissors) => {
      return (elements, element, choice) => element === paper && (elements[choice] === scissors);
    }])
    .factory('isPaperWin', [paper, rock, (paper, rock) => {
      return (elements, element, choice) => element === paper && (elements[choice] === rock);
    }])
    .factory('isScissorsLoss', [scissors, rock, (scissors, rock) => {
      return (elements, element, choice) => element === scissors && (elements[choice] === rock);
    }])
    .factory('isScissorsWin', [scissors, paper, (scissors, paper) => {
      return (elements, element, choice) => element === scissors && (elements[choice] === paper);
    }])
    .factory('drawAlert', ['showAlert', showAlert => {
      return _ => {
        showAlert({
          title: draw,
          template: sameElementMessage,
        });
      };
    }])
    .factory('lossAlert', ['showAlert', (showAlert) => {
      return (imagePath) => {
        showAlert({
          title: loss,
          template: resImgTag(imagePath),
        });
      };
    }])
    .factory('winAlert', ['showAlert', (showAlert) => {
      return (imagePath) => {
        showAlert({
          title: gain,
          template: resImgTag(imagePath),
        });
      };
    }])
    .factory('uncoveredAlert', ['showAlert', (showAlert) => {
      return () => {
        showAlert({
          title: uncovered,
          template: uncovered
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
      $scope.rock = ROCK;
      $scope.paper = PAPER;
      $scope.scissors = SCISSORS;
      score = new Score({
          persistant: true,
          callback: function () {},
          levels: [
            {
              checkmark: 10,
              status: 'novato',
              quote: 'Você esta apenas começando.',
            }, {
              checkmark: 20,
              status: 'aprendiz',
              quote: 'Agora, você tem alguma expêriencia.'
            }, {
              checkmark: 30,
              status: 'veterano',
              quote: 'Você tem uma boa expêriencia.'
            }
          ]
      });
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
          lossAlert(visualElements[paperWin]);
          $scope.losses += 1;
          score.decrement();
        } else if (isRockWin(elements, element, machineChoose)) {
          winAlert(visualElements[win]);
          $scope.wins += 1;
          score.increment();
        } else if (isPaperLoss(elements, element, machineChoose)) {
          lossAlert(visualElements[scissorsWin]);
          $scope.losses += 1;
          score.decrement();
        } else if (isPaperWin(elements, element, machineChoose)) {
          winAlert(visualElements[win]);
          $scope.wins += 1;
          score.increment();
        } else if (isScissorsLoss(elements, element, machineChoose)) {
          lossAlert(visualElements[rockWin]);
          $scope.losses += 1;
          score.decrement();
        } else if (isScissorsWin(elements, element, machineChoose)) {
          winAlert(visualElements[win]);
          $scope.wins += 1;
          score.increment();
        } else {
          uncoveredAlert();
          $scope.losses += 1;
          score.decrement();
        }

        $scope.rounds += 1;
        $scope.yourChoices.push(element);

        $log.debug(score.scorecard());
      };
      $scope.score = score;
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
