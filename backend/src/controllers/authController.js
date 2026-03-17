const crypto = require('crypto');
const { OAuth2Client } = require('google-auth-library');
const User = require('../models/User');
const { generateToken } = require('../utils/jwtUtils');
const { sendSuccess, sendError } = require('../utils/apiResponse');
const sendEmail = require('../utils/sendEmail');

const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) return sendError(res, 400, 'Email already registered');

    const user = await User.create({ name, email, password, role: 'student' });

    const token = generateToken(user._id);

    sendSuccess(res, 201, 'Registration successful', {
      token,
      user: { _id: user._id, name: user.name, email: user.email, role: user.role, avatar: user.avatar },
    });
  } catch (error) {
    next(error);
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select('+password');
    if (!user) return sendError(res, 401, 'Invalid credentials');
    if (!user.password) return sendError(res, 400, 'This account uses Google login. Please sign in with Google.');
    if (!user.isActive) return sendError(res, 403, 'Account is deactivated');

    const isMatch = await user.comparePassword(password);
    if (!isMatch) return sendError(res, 401, 'Invalid credentials');

    const token = generateToken(user._id);

    sendSuccess(res, 200, 'Login successful', {
      token,
      user: { _id: user._id, name: user.name, email: user.email, role: user.role, avatar: user.avatar },
    });
  } catch (error) {
    next(error);
  }
};

const getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    sendSuccess(res, 200, 'User fetched', { user });
  } catch (error) {
    next(error);
  }
};

const updateProfile = async (req, res, next) => {
  try {
    const { name, avatar } = req.body;
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { name, avatar },
      { new: true, runValidators: true }
    );
    sendSuccess(res, 200, 'Profile updated', { user });
  } catch (error) {
    next(error);
  }
};

const changePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const user = await User.findById(req.user._id).select('+password');

    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) return sendError(res, 400, 'Current password is incorrect');

    user.password = newPassword;
    await user.save();

    sendSuccess(res, 200, 'Password changed successfully');
  } catch (error) {
    next(error);
  }
};

const forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) return sendError(res, 404, 'No account found with that email');
    if (!user.isActive) return sendError(res, 403, 'Account is deactivated');

    const resetToken = user.createPasswordResetToken();
    await user.save({ validateBeforeSave: false });

    const resetUrl = `${process.env.CLIENT_URL}/reset-password/${resetToken}`;

    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 480px; margin: auto;">
        <h2 style="color: #2563eb;">Lucent Shorthand Classes — Password Reset</h2>
        <p>Hi <strong>${user.name}</strong>,</p>
        <p>You requested a password reset. Click the button below to set a new password:</p>
        <a href="${resetUrl}" style="display: inline-block; padding: 12px 28px; background: #2563eb; color: #fff; text-decoration: none; border-radius: 8px; font-weight: bold; margin: 16px 0;">Reset Password</a>
        <p style="color: #888; font-size: 13px;">This link expires in 15 minutes. If you didn't request this, ignore this email.</p>
      </div>
    `;

    await sendEmail({ to: user.email, subject: 'Lucent Shorthand Classes — Password Reset', html });

    sendSuccess(res, 200, 'Password reset link sent to your email');
  } catch (error) {
    next(error);
  }
};

const resetPassword = async (req, res, next) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

    const user = await User.findOne({
      passwordResetToken: hashedToken,
      passwordResetExpires: { $gt: Date.now() },
    }).select('+passwordResetToken +passwordResetExpires');

    if (!user) return sendError(res, 400, 'Token is invalid or has expired');

    user.password = password;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save();

    sendSuccess(res, 200, 'Password reset successful. You can now log in.');
  } catch (error) {
    next(error);
  }
};

const googleLogin = async (req, res, next) => {
  try {
    const { credential } = req.body
    if (!credential) return sendError(res, 400, 'Google credential is required')

    const ticket = await googleClient.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    })
    const payload = ticket.getPayload();
    const { sub: googleId, email, name, picture } = payload;

    let user = await User.findOne({ email });

    if (user) {
      // Link Google account if not already linked
      if (!user.googleId) {
        user.googleId = googleId;
        if (picture && !user.avatar) user.avatar = picture;
        await user.save({ validateBeforeSave: false });
      }
      if (!user.isActive) return sendError(res, 403, 'Account is deactivated');
    } else {
      // Create new student account
      user = await User.create({
        name,
        email,
        googleId,
        avatar: picture || '',
        role: 'student',
      });
    }

    const token = generateToken(user._id);

    sendSuccess(res, 200, 'Google login successful', {
      token,
      user: { _id: user._id, name: user.name, email: user.email, role: user.role, avatar: user.avatar },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { register, login, googleLogin, getMe, updateProfile, changePassword, forgotPassword, resetPassword };
