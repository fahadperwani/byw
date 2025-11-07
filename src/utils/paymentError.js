class PaymentError extends Error {
  constructor(message, status = 400) {
    super(message);
    this.name = "PaymentError";
    this.status = status;
  }
}

module.exports = PaymentError;
