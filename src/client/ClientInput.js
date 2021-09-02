import EventSourceMixin from '../common/EventSourceMixin';

class ClientInput {
  constructor(canvas) {
    Object.assign(this, {
      canvas,
      keysPressed: new Set(), // клавиши, зажатые в данный момент
      keyStateHandlers: {}, // обработчики, срабатывающие каждый рендер, если нажата клавиша
      keyHandlers: {}, // обработчики при нажатии определенной клавиши
    });
    canvas.addEventListener('keydown', (e) => this.onKeyDown(e), false);
    canvas.addEventListener('keyup', (e) => this.onKeyUp(e), false);
  }

  onKeyDown(e) {
    this.keysPressed.add(e.code);
    if (this.keyHandlers[e.code]) this.keyHandlers[e.code](true);
    this.trigger('keydown', e);
    window.document.body.style.overflow = 'hidden';
  }

  onKeyUp(e) {
    this.keysPressed.delete(e.code);
    if (this.keyHandlers[e.code]) this.keyHandlers[e.code](false);
    this.trigger('keyup', e);
    window.document.body.style.overflow = 'auto';
  }

  onKey({ ...handlers }) {
    this.keyHandlers = { ...this.keyHandlers, ...handlers };
  }
}

Object.assign(ClientInput.prototype, EventSourceMixin);

export default ClientInput;
