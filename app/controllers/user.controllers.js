const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { User } = require('../models');
const crypto = require('crypto');
const sendEmail = require('../utils/sendEmail');
const { Op } = require('sequelize');

const getMe = (req, res) => {
  res.send({ ...req.user.toJSON(), role: req.user.role });
};

const getById = async (req, res) => {
  try {
    console.log("Requested ID:", req.params.id);
    const user = await User.findOne({
      where: {
        idUser: req.params.id,
      },
    });
    console.log("User found:", user);
    if (!user) throw new Error('User not found');
    res.send(user);
  } catch (error) {
    console.error("Error in getById:", error);
    res.status(400).send({ errors: error.message });
  }
};


const getAll = async (req, res) => {
  try {
    const users = await User.findAll();
    res.send(users);
  } catch (error) {
    res.status(500).send({ message: 'Erreur lors de la récupération des utilisateurs' });
  }
};

const getSellers = async (req, res) => {
    try {
      const users = await User.findAll({
        where: { role: 'seller' } 
      });
      res.send(users);
    } catch (error) {
      res.status(500).send({ message: 'Erreur lors de la récupération des vendeurs' });
    }
};


const getManagersAndAdmins = async (req, res) => {
    try {
        const users = await User.findAll({
            where: {
                role: ['manager', 'admin']
            }
        });
        res.send(users);
    } catch (error) {
        res.status(500).send({ message: 'Erreur lors de la récupération des administrateurs' });
    }
};

const getAspiringManagers = async (req,res) => {
    try {
        const users = await User.findAll({
            where: {
                aspiringManager: true 
            }
        });
        res.send(users);
    } catch (error) {
        res.status(500).send({ message: 'Erreur lors de la récupération des utilisateurs souhaitant devenir gestionnaire' });
    }
}

const updateAdresse = async (req, res) => {
  const { id } = req.params;
  const { adresse } = req.body;

  try {
    const user = await User.findByPk(id);
    if (!user) return res.status(404).send({ message: 'Utilisateur non trouvé' });

    user.adresse = adresse;
    await user.save();

    res.send({ message: 'Adresse mise à jour avec succès', user });
  } catch (error) {
    res.status(500).send({ message: 'Erreur lors de la mise à jour de l\'adresse', error: error.message });
  }
};

const updatePostalCode = async (req, res) => {
  const { id } = req.params;
  const { postalCode } = req.body;

  try {
    const user = await User.findByPk(id);
    if (!user) return res.status(404).send({ message: 'Utilisateur non trouvé' });

    user.postalCode = postalCode;
    await user.save();

    res.send({ message: 'Code postal mis à jour avec succès', user });
  } catch (error) {
    res.status(500).send({ message: 'Erreur lors de la mise à jour du code postal', error: error.message });
  }
};

// Mise à jour de la ville
const updateVille = async (req, res) => {
  const { id } = req.params;
  const { ville } = req.body;

  try {
    const user = await User.findByPk(id);
    if (!user) return res.status(404).send({ message: 'Utilisateur non trouvé' });

    user.ville = ville;
    await user.save();

    res.send({ message: 'Ville mise à jour avec succès', user });
  } catch (error) {
    res.status(500).send({ message: 'Erreur lors de la mise à jour de la ville', error: error.message });
  }
};

// Mise à jour du prénom
const updateFirstName = async (req, res) => {
  const { id } = req.params;
  const { firstName } = req.body;

  try {
    const user = await User.findByPk(id);
    if (!user) return res.status(404).send({ message: 'Utilisateur non trouvé' });

    user.firstName = firstName;
    await user.save();

    res.send({ message: 'Prénom mis à jour avec succès', user });
  } catch (error) {
    res.status(500).send({ message: 'Erreur lors de la mise à jour du prénom', error: error.message });
  }
};

// Mise à jour du nom
const updateLastName = async (req, res) => {
  const { id } = req.params;
  const { lastName } = req.body;

  try {
    const user = await User.findByPk(id);
    if (!user) return res.status(404).send({ message: 'Utilisateur non trouvé' });

    user.lastName = lastName;
    await user.save();

    res.send({ message: 'Nom mis à jour avec succès', user });
  } catch (error) {
    res.status(500).send({ message: 'Erreur lors de la mise à jour du nom', error: error.message });
  }
};

// Mise à jour de l'email
const updateEmail = async (req, res) => {
  const { id } = req.params;
  const { email } = req.body;

  try {
    const user = await User.findByPk(id);
    if (!user) return res.status(404).send({ message: 'Utilisateur non trouvé' });

    user.email = email;
    await user.save();

    res.send({ message: 'Email mis à jour avec succès', user });
  } catch (error) {
    res.status(500).send({ message: 'Erreur lors de la mise à jour de l\'email', error: error.message });
  }
};

// Mise à jour du téléphone
const updateTelephone = async (req, res) => {
  const { id } = req.params;
  const { telephone } = req.body;

  try {
    const user = await User.findByPk(id);
    if (!user) return res.status(404).send({ message: 'Utilisateur non trouvé' });

    user.telephone = telephone;
    await user.save();

    res.send({ message: 'Téléphone mis à jour avec succès', user });
  } catch (error) {
    res.status(500).send({ message: 'Erreur lors de la mise à jour du téléphone', error: error.message });
  }
};

const toggleRole = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    const newRole = req.body.role;
    if (!user) return res.status(404).send({ message: 'Utilisateur non trouvé' });

    if (user.role === 'admin' && newRole !== 'admin') {
      const adminCount = await User.count({ where: { role: 'admin' } });
      if (adminCount <= 1) {
        return res.status(400).send({ message: "Il doit toujours y avoir au moins un administrateur" });
      }
    }
    user.role = req.body.role;
    await user.save();

    res.send({ role: user.role });
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: 'Erreur serveur' });
  }
};

const updateUserRoleToManager = async (req, res) => {
    try {
        const { id } = req.params; 

        const user = await User.findByPk(id);
        if (!user) {
            return res.status(404).send({ message: 'Utilisateur non trouvé' });
        }

        user.role = 'manager';
        user.aspiringManager = false;
        await user.save();

        res.send({ message: 'Rôle de l\'utilisateur mis à jour avec succès', user });
    } catch (error) {
        res.status(500).send({ message: 'Erreur lors de la mise à jour du rôle de l\'utilisateur' });
    }
};

const deleteAspiringManager = async (req, res) => {
    try {
        const { id } = req.params; 

        const user = await User.findByPk(id);
        if (!user) {
            return res.status(404).send({ message: 'Utilisateur non trouvé' });
        }

        user.aspiringManager = false;
        await user.save();

        res.send({ message: 'Demande de l\'utilisateur mis à jour avec succès', user });
    } catch (error) {
        res.status(500).send({ message: 'Erreur lors de la mise à jour de la demande de l\'utilisateur' });
    }
};



const getUserDetails = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id, {
      // Ici, vous pouvez spécifier les attributs que vous souhaitez inclure
      attributes: ['id', 'email', 'firstName', 'lastName', /* autres attributs */],
    });

    if (!user) {
      return res.status(404).send({ message: "Utilisateur non trouvé" });
    }
    res.send(user);
  } catch (error) {
    res.status(500).send({ message: "Erreur lors de la récupération de l'utilisateur" });
  }
};

const deleteUser = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) {
      return res.status(400).send({ message: 'Utilisateur non trouvé' });
    }
    if (user.role === 'admin') {
      // Comptez le nombre total d'administrateurs
      const adminCount = await User.count({ where: { role: 'admin' } });
      // Si l'utilisateur est le dernier administrateur, empêchez la suppression
      if (adminCount <= 1) {
        return res.status(400).send({ message: "Suppression impossible, c'est le dernier administrateur" });
      }
    }

    await user.destroy();
    res.send({ message: 'Utilisateur supprimé avec succès' });
  } catch (error) {
    res.status(500).send({ message: 'Erreur lors de la suppression de l\'utilisateur' });
  }
};

function isEmail(identifier) {
  return /\S+@\S+\.\S+/.test(identifier);
}

const login = async (req, res) => {
  try {
    let user;
    if (isEmail(req.body.identifier)) {
      // Si l'identifiant est un email
      user = await User.findOne({
        where: { email: req.body.identifier }
      });
    } else {
      // Sinon, supposez que c'est un numéro de téléphone
      user = await User.findOne({
        where: { telephone: req.body.identifier }
      });
    }

    if (!user) throw new Error('User not found');

    const isMatching = await bcrypt.compare(req.body.password, user.password);

    if (!isMatching) throw new Error('Invalid password');

    const token = jwt.sign({ id: user.idUser, admin: user.role === 'admin' }, process.env.JWT_SECRET, { expiresIn: '24h' });

    res.send({ accessToken: token });
  } catch (error) {
    console.log(error);
    res.status(400).send({ errors: error.message });
  }
};


const create = async (req, res) => {
  try {
    const errors = [];

    // Validation des expressions régulières en amont
    const postalCodeRegex = /^\d{5}$/;
    const telephoneRegex = /^\d{10}$/;
    const firstNameRegex = /^[a-zA-Z]+([ -][a-zA-Z]+)*$/;
    const lastNameRegex = /^[a-zA-Z\s]+$/;

    // Validation des champs
    if (req.body.postalCode && !postalCodeRegex.test(req.body.postalCode)) errors.push('Invalid postal code');
    if (!telephoneRegex.test(req.body.telephone)) errors.push('Invalid phone number format');
    if (!firstNameRegex.test(req.body.firstName)) errors.push('Invalid first name format');
    if (!lastNameRegex.test(req.body.lastName)) errors.push('Invalid last name format');

    // Validation spécifique pour l'email
    if (req.body.email && req.body.email !== '') {
      if (!/\S+@\S+\.\S{2,3}/.test(req.body.email)) errors.push('Invalid email');
      const alreadyCreated = await User.findOne({ where: { email: req.body.email } });
      if (alreadyCreated) errors.push('Email already used !');
    }
    // Vérification de la présence d'erreurs
    if (errors.length > 0) {
      throw new Error(JSON.stringify(errors));
    }

    // Création de l'utilisateur
    const user = await User.create({
      email: req.body.email || null, 
      password: req.body.password,
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      telephone: req.body.telephone,
      ville: req.body.ville,
      postalCode: req.body.postalCode,
      adresse: req.body.adresse,
      aspiringManager: req.body.aspiringManager,
    });

    const token = jwt.sign({ id: user.idUser, admin: user.role === 'admin' }, process.env.JWT_SECRET, { expiresIn: '24h' });
    res.send({ accessToken: token });
  } catch (error) {
    res.status(400).send({ errors: error.message });
  }
};


// Demande de réinitialisation du mot de passe
const forgotPassword = async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(404).send("Aucun utilisateur trouvé avec cet e-mail.");
    }

    // Génération du token de réinitialisation
    const resetToken = crypto.randomBytes(20).toString('hex');
    // Hashage du token pour le stockage sécurisé
    user.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');
    user.resetPasswordExpire = Date.now() + 3600000; // 1 heure

    await user.save();

    // Construction de l'URL de réinitialisation
    const resetUrl = `${req.protocol}://localhost:3000/resetPassword/${resetToken}`;

    const message = `Vous recevez ce message car vous avez demandé la réinitialisation du mot de passe de votre compte. Veuillez cliquer sur le lien suivant, ou le coller dans votre navigateur pour compléter le processus : \n\n ${resetUrl}`;

    // Envoi de l'email
    try {
      await sendEmail({
        email: user.email,
        subject: 'Réinitialisation de mot de passe',
        message,
      });

      res.status(200).send({ success: true, data: "Email envoyé." });
    } catch (err) {
      console.log(err);
      user.resetPasswordToken = undefined;
      user.resetPasswordExpire = undefined;

      await user.save();
      return res.status(500).send('Erreur lors de l\'envoi de l\'email.');
    }
  } catch (err) {
    console.error(err);
    res.status(500).send('Erreur serveur.');
  }
};

// Réinitialisation du mot de passe
const resetPassword = async (req, res) => {
  const resetPasswordToken = crypto.createHash('sha256').update(req.params.resetToken).digest('hex');
  const newPassword = req.body.password;
  // Validation du nouveau mot de passe
  if (!newPassword) {
    return res.status(400).send('Veuillez entrer un mot de passe.');
  } else if (newPassword.length < 8) {
    return res.status(400).send('Le mot de passe doit contenir au moins 8 caractères.');
  } else if (!/^(?=.*\d)(?=.*[A-Z])(?=.*\W).{8,}$/.test(newPassword)) {
    return res.status(400).send('Le mot de passe doit contenir au moins un chiffre, une lettre en majuscule, une lettre en minuscule et un caractère spécial.');
  }
  try {
    const user = await User.findOne({
      where: {
        resetPasswordToken,
        resetPasswordExpire: { [Op.gt]: Date.now() },
      },
    });

    if (!user) {
      return res.status(400).send('Token de réinitialisation invalide ou expiré.');
    }

    // Mise à jour du mot de passe
    user.password = bcrypt.hashSync(req.body.password, 10);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();

    res.status(200).send({
      success: true,
      message: 'Mot de passe réinitialisé avec succès.',
    });
  } catch (err) {
    console.error(err);
    res.status(500).send('Erreur serveur.');
  }
};

const updatePassword = async (req, res) => {
  try {
    // Recherche de l'utilisateur par ID
    const user = await User.findByPk(req.params.id);

    if (!user) {
      return res.status(404).json({ success: false, message: 'Utilisateur non trouvé' });
    }

    // Valider le nouveau mot de passe (s'il y a lieu)

    // Crypter le nouveau mot de passe
    const hashedPassword = bcrypt.hashSync(req.body.newPassword, 10);

    // Mettre à jour le mot de passe de l'utilisateur
    user.password = hashedPassword;
    await user.save();

    return res.status(200).json({ success: true, message: 'Mot de passe mis à jour avec succès' });
  } catch (error) {
    console.error("Erreur lors de la mise à jour du mot de passe :", error);

    return res.status(500).json({ success: false, message: 'Erreur serveur lors de la mise à jour du mot de passe' });
  }
};

const verifyCurrentPassword = async (req, res) => {
  try {
    const { idUser, oldPassword, newPassword } = req.body;
    console.log(idUser, oldPassword, newPassword);
    const user = await User.findByPk(idUser);
    if (!user) return res.status(500).send({ message: 'Utilisateur non trouvé' });

    const isMatching = await bcrypt.compare(oldPassword, user.password);
    if (!isMatching) return res.status(401).send({ message: 'Ancien mot de passe invalide' });

    const hashedNewPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedNewPassword;
    await user.save();

    res.send({ message: 'Mot de passe mis à jour avec succès.' });
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: 'Erreur serveur' });
  }
};

module.exports = { getMe, getById, updatePassword, verifyCurrentPassword, getAll, getSellers, getManagersAndAdmins, getAspiringManagers, deleteUser, toggleRole, updateUserRoleToManager, deleteAspiringManager, getUserDetails, create, login, forgotPassword, resetPassword, updateAdresse, updateEmail, updateFirstName, updateLastName, updatePostalCode, updateTelephone, updateVille };
