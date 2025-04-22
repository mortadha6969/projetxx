const { pool } = require('../config/database');
const bcrypt = require('bcryptjs');

const userModel = {
    // Create a new user
    create: async ({ username, email, password, firstName, lastName }) => {
        const hashedPassword = await bcrypt.hash(password, 10);
        const [result] = await pool.query(
            'INSERT INTO User (username, email, password, firstName, lastName) VALUES (?, ?, ?, ?, ?)',
            [username, email, hashedPassword, firstName, lastName]
        );
        return result.insertId;
    },

    // Find user by email
    findByEmail: async (email) => {
        const [rows] = await pool.query(
            'SELECT * FROM User WHERE email = ?',
            [email]
        );
        return rows[0];
    },

    // Find user by id
    findById: async (id) => {
        const [rows] = await pool.query(
            'SELECT id, username, email, firstName, lastName, profileImage, createdAt, updatedAt FROM User WHERE id = ?',
            [id]
        );
        return rows[0];
    },

    // Update user
    update: async (id, updates) => {
        const allowedUpdates = ['firstName', 'lastName', 'profileImage'];
        const updateFields = Object.keys(updates)
            .filter(key => allowedUpdates.includes(key) && updates[key] !== undefined)
            .map(key => `${key} = ?`);
        
        if (updateFields.length === 0) return false;

        const values = updateFields.map(field => updates[field.split(' ')[0]]);
        values.push(id);

        const [result] = await pool.query(
            `UPDATE User SET ${updateFields.join(', ')} WHERE id = ?`,
            values
        );
        return result.affectedRows > 0;
    },

    // Delete user
    delete: async (id) => {
        const [result] = await pool.query(
            'DELETE FROM User WHERE id = ?',
            [id]
        );
        return result.affectedRows > 0;
    }
};

module.exports = userModel;