Vue.component('minesweeper', {
  template: '#template-minesweeper',
  data() {
      return {
          timerCount: 0,
          timer: null,
          game: null,
      };
  },
  computed: {
      mine() {
          return (cell) => {
              return cell.isOpen && !cell.isMine && cell.mineCount ? cell.mineCount : null;
          };
      },
      classes() {
          return (cell) => {
              return {
                  cell: true,
                  open: cell.isOpen,
                  mine: cell.isOpen && cell.isMine,
                  flag: cell.isFlag,
              };
          };
      },
      state() {
        if (this.game.gameclear) {
          return 'gameclear';
        } else if (this.game.gameover) {
          return 'gameover';
        } else {
          return null;
        }
      }
  },
  methods: {
      open(cell) {
          this.game.open(cell.index);
          if (!this.timer) {
              this.timer = setInterval(() => {
                  this.timerCount++;
              }, 1000);
          }
          if (this.game.gameclear || this.game.gameover) {
              clearInterval(this.timer);
              this.timer = null;
          }
      },
      toggleFlag(cell) {
          this.game.toggleFlag(cell.index);
      },
      reset(config) {
          clearInterval(this.timer);
          this.timer = null;
          this.timerCount = 0;
          
          if (config) {
              this.game = new Minesweeper(
                  Number(config.width),
                  Number(config.height),
                  Number(config.mine)
              );
          } else {
              this.game.reset();
          }
      },
  },
});

Vue.component('minesweeper-config', {
  template: '#template-minesweeper-config',
  data() {
      return {
          config: JSON.parse(localStorage.getItem('config')) || {
              width: 10,
              height: 10,
              mine: 10,
          },
      };
  },
  methods: {
      apply() {
          localStorage.setItem('config', JSON.stringify(this.config));
          this.$emit('apply', this.config);
      },
  },
});

new Vue({
  el: '#app',
  data: {
      mineCount: 0,
      timerCount: 0,
      width: 0,
      height: 0,
      game: null,
  },
  methods: {
      apply(config) {
          this.$refs.game.reset(config);
      },
  },
});
