// controllers/transactionController.js
const Transaction = require('../models/Transaction');

exports.getAllTransactions = async (req, res) => {
  try {
    const transactions = await Transaction.find().populate('campaign').populate('donor');
    res.json(transactions);
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error });
  }
};

exports.getTransactionById = async (req, res) => {
  try {
    const transaction = await Transaction.findById(req.params.id)
      .populate('campaign')
      .populate('donor');
    if (!transaction) {
      return res.status(404).json({ message: 'Transaction introuvable.' });
    }
    res.json(transaction);
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error });
  }
};

// Simule le traitement de la transaction (process)
exports.processTransaction = async (req, res) => {
  // Ici vous pourriez appeler un service de paiement
  res.json({ message: 'Transaction traitée' });
};

// Simule le remboursement
exports.refundTransaction = async (req, res) => {
  // Ici vous pourriez appeler un service de remboursement
  res.json({ message: 'Transaction remboursée' });
};
