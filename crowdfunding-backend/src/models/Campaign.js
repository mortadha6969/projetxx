const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');
const fs = require('fs').promises;
const path = require('path');

const Campaign = sequelize.define('Campaign', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: 'user_id',
        references: {
            model: 'users',
            key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
    },
    title: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            len: [5, 100]
        }
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: false,
        validate: {
            len: [50, 5000]
        }
    },
    target: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        validate: {
            min: 100
        }
    },
    donated: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 0,
        validate: {
            min: 0
        }
    },
    donors: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
        validate: {
            min: 0
        }
    },
    endDate: {
        type: DataTypes.DATE,
        allowNull: false,
        validate: {
            isDate: true,
            isFuture(value) {
                if (value <= new Date()) {
                    throw new Error('End date must be in the future');
                }
            }
        }
    },
    imageUrl: {
        type: DataTypes.STRING,
        allowNull: true,
        validate: {
            isValidPath(value) {
                if (value && !value.startsWith('/uploads/')) {
                    throw new Error('Invalid image path format');
                }
            }
        }
    },
    status: {
        type: DataTypes.ENUM('active', 'completed', 'cancelled'),
        defaultValue: 'active',
        validate: {
            isIn: [['active', 'completed', 'cancelled']]
        }
    },
    iteration: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1,
        validate: {
            min: 1
        }
    },
    previousIterationId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        field: 'previous_iteration_id',
        references: {
            model: 'campaigns',
            key: 'id'
        }
    },
    iterationEndReason: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    files: {
        type: DataTypes.JSON,
        defaultValue: [],
        allowNull: true,
        validate: {
            isValidFileArray(value) {
                if (value && !Array.isArray(value)) {
                    throw new Error('Files must be an array');
                }
                if (value && value.length > 5) {
                    throw new Error('Maximum 5 files allowed');
                }
                if (value) {
                    value.forEach(file => {
                        if (!file.url || !file.name || !file.type) {
                            throw new Error('Each file must have url, name, and type properties');
                        }
                    });
                }
            }
        }
    }
}, {
    tableName: 'campaigns',
    underscored: true,
    timestamps: true,
    hooks: {
        beforeValidate: (campaign) => {
            // Ensure donated amount doesn't exceed target
            if (campaign.donated > campaign.target) {
                throw new Error('Donated amount cannot exceed target amount');
            }
        },
        beforeDestroy: async (campaign) => {
            // Clean up associated files when campaign is deleted
            if (campaign.imageUrl) {
                try {
                    const filePath = path.join(__dirname, '..', '..', campaign.imageUrl);
                    await fs.access(filePath);
                    await fs.unlink(filePath);
                } catch (err) {
                    console.error('Error deleting campaign image:', err);
                }
            }
        }
    }
});

// Define associations - these will be set up in the index.js file
// Campaign.belongsTo(User, { foreignKey: 'userId', as: 'user' });
// Campaign.hasMany(Transaction, { foreignKey: 'campaign_id', as: 'donations' });

module.exports = Campaign;
