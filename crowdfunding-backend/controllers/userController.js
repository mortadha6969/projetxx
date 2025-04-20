// controllers/userController.js
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Campaign = require('../models/Campaign');
const Transaction = require('../models/Transaction');

exports.register = async (req, res) => {
  try {
    const { email, password, username } = req.body;

    // Validate input
    if (!email || !password || !username) {
      return res.status(400).json({ 
        message: 'Email, password and username are required' 
      });
    }

    // Check if user exists
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ 
        message: 'Email is already registered' 
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const newUser = await User.create({
      email,
      username,
      password: hashedPassword
    });

    // Generate token
    const token = jwt.sign(
      { id: newUser.id, email: newUser.email },
      process.env.JWT_SECRET || 'secretKey',
      { expiresIn: '1d' }
    );

    // Remove password from response
    const userResponse = {
      id: newUser.id,
      email: newUser.email,
      username: newUser.username,
      createdAt: newUser.createdAt
    };

    res.status(201).json({ 
      message: 'User registered successfully',
      token,
      user: userResponse
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ 
      message: 'Error registering user',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    // Find user
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Generate token
    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET || 'secretKey',
      { expiresIn: '1d' }
    );

    // Remove password from response
    const userResponse = {
      id: user.id,
      email: user.email,
      username: user.username,
      createdAt: user.createdAt
    };

    res.json({ 
      message: 'Login successful',
      token,
      user: userResponse
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ 
      message: 'Error during login',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// (Exemple) Créer une campagne
exports.createCampaign = async (req, res) => {
  try {
    // L'ID de l'utilisateur peut provenir du token JWT décodé
    const userId = req.userId; // supposons qu'on l'ait stocké dans un middleware d'auth
    const { title, description, goal } = req.body;

    const campaign = new Campaign({
      title,
      description,
      goal,
      owner: userId
    });

    await campaign.save();
    res.status(201).json({ message: 'Campagne créée avec succès', campaign });
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error });
  }
};

// (Exemple) Faire une donation
exports.makeDonation = async (req, res) => {
  try {
    const userId = req.userId; // supposons qu'on l'ait stocké dans un middleware d'auth
    const { campaignId, amount, method } = req.body;

    // Vérifier la campagne
    const campaign = await Campaign.findById(campaignId);
    if (!campaign) {
      return res.status(404).json({ message: 'Campagne introuvable.' });
    }

    // Créer la transaction
    const transaction = new Transaction({
      amount,
      method,
      campaign: campaign._id,
      donor: userId
    });
    await transaction.save();

    // Mettre à jour le solde de la campagne
    campaign.balance += amount;
    await campaign.save();

    res.status(201).json({ message: 'Donation effectuée avec succès', transaction });
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error });
  }
};
