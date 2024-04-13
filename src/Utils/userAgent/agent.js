const agent = {
  get UA() {
    return navigator.userAgent.toLowerCase();
  },
  get Ipad() {
    return 'MacIntel' === navigator.platform && navigator.maxTouchPoints > 1;
  },
  get Mobile() {
    return /mobi|android|tablet|ipad|iphone/.test(this.UA) || this.Ipad;
  }
};

console.log(agent.Mobile);

export default agent;
