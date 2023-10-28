const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const User = require("../../model/user");

const register = async (req, res) => {
  try {
    // Check if the user already exists
    const existingUser = await User.findOne({ email: req.body.email.toLowerCase() }).exec();
    if (existingUser) {
      return res.status(400).json({
        message: "User already exists",
        success: false,
      });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(req.body.password, 10);

    // Create a new user
    const user = new User({
      username: req.body.username,
      email:  req.body.email.toLowerCase(),
      password: hashedPassword,
    });

    await user.save();

    res.status(201).json({
      message: "Account successfully created",
      success: true,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      success: false,
    });
  }
};

const login = async (req, res) => {
    const cookies = req.cookies;
    console.log(`cookie available at login: ${JSON.stringify(cookies)}`);
    try {
      // Check if the user exists
      const foundUser = await User.findOne({ username: req.body.username })
        .select("+password")
        .exec();
      if (!foundUser) {
        return res.status(401).json({
          message: "Unauthorized",
          success: false,
        });
      }
  
      // Validate the password
      const isPasswordValid = await bcrypt.compare(req.body.password, foundUser.password);
      if (!isPasswordValid) {
        return res.status(401).json({
          message: "Invalid credentials",
          success: false,
        });
      }

      const cookiesOptions = {
        httpOnly: true,
        sameSite: 'lax',    
      }
      if (process.env.NODE_ENV === 'production') cookiesOptions.secure = true;
  
      // Generate JWT token
      const accessToken = jwt.sign(
        {
          UserInfo: {
            id: foundUser._id,
            email: foundUser.email,
            username: foundUser.username,
          },
        },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: "15m" }
      );
  
      const refreshToken = jwt.sign(
        {
          username: foundUser.username,
        },
        process.env.REFRESH_TOKEN_SECRET,
        { expiresIn: "7d" }
      );

      // Creates Secure Cookie with access token
      res.cookie("jwt", accessToken, {
        cookiesOptions,
        maxAge: 15 * 60 * 60 * 1000,
      });
      
      // Creates Secure Cookie with refresh token
      res.cookie("jwt", refreshToken, {
        cookiesOptions,
        maxAge: 24 * 60 * 60 * 1000,
      });

      res.cookie('logged_in', true, {
        expiresIn: "15m",
        sameSite: 'lax', 
        httpOnly: false,
        maxAge: 15 * 60 * 60 * 1000,
      });
  
      // Send the JWT accessToken with success message in the response
      res.json({
        accessToken: accessToken,
        message: "Login is successful",
        success: true,
      });
    } catch (error) {
      res.status(500).json({
        message: "Server error",
        success: false,
      });
    }
  };

  const forgotPassword = async (req, res) => {
  try {
    const foundUser = await User.findOne({ email: req.body.email }).exec();
    if (!foundUser) {
      return res.status(404).json({
        message: 'The email address does not exists',
        success: false,
      });
    }
    // save update user
    await foundUser.save();

    console.log(`The password was successfully reset`);
    return res.status(200).json({
      message: `The password was successfully reset`,
      success: true,
    });
  } catch (error) {
    return res.status(500).json({
      message: 'server error',
      success: false,
    });
  }
};

const resetPassword = async (req, res) => {
  const { token, newPassword } = req.body;
  console.log(token)
  try {
    if (!token || !newPassword) {
      return res.status(400).json({
        message: 'Token and password are required',
        success: false,
      });
    }

    // Verify the reset token
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    console.log(decoded)

    // Find the user by their ID
    const foundUser = await User.findById(decoded.UserInfo.id)
      .select('+_id')
      .exec();
    if (!foundUser) {
      return res.status(404).json({
        message: 'User not found',
        success: false,
      });
    }

    // Check if the provided password matches the user's current password
    const isMatch = await bcrypt.compare(newPassword, foundUser.password);
    if (isMatch) {
      return res.status(400).json({
        message: 'New password must be different from the current password',
        success: false,
      });
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update the user's password
    foundUser.password = hashedPassword;

    // Save the changes to the user document
    await foundUser.save();
    return res.status(200).json({
      message: 'Password reset successful',
      success: true,
    });
  } catch (error) {
    return res.status(500).json({
      message: 'Server error',
      success: false,
    });
  }
};

const logout = async (req, res) => {
  // On client, also delete the accessToken
  const cookies = req.cookies;
  if (!cookies?.jwt) {
    res.clearCookie('jwt', { httpOnly: true, sameSite: 'None', secure: true });
    return res.status(204).json({
      message: 'The refreshToken is successfully cleared',
      success: false,
    });
  }

  // update user status & updateAt time
  await User.findByIdAndUpdate(
    foundUser._id,
    { status: 'logout', updatedAt: Date.now() },
    { new: true }
  );

  res.clearCookie('jwt', { httpOnly: true, sameSite: 'lax', });
  res.status(200).json({
    data,
    message: 'Cookie cleared',
    success: true,
  });
};

const getAllUsers = async(req, res) => {
  try {
    // Retrieve all of the users from the database
    const users = await User.find()

    // Send the users back to the client
    return res.status(200).json({
      message: "All users retrieved from the database successfully",
      users,
      success: true
    })
  } catch (error) {
    return res.status(500).json({
      message: 'Server error',
      success: false,
    });
  }
}

const getUserById = async(req, res) => {
  try {
    const user = await User.findById(req.params.id)
    if(!user){
      return res.status(404).json({
        message: 'User not found',
        success: false,
      });
    }
      return res.status(200).json({
        message: "User's details are retrieved successfully",
        user,
        success: true,
      })

  } catch (error) {
    return res.status(500).json({
      message: 'Server error',
      success: false,
    });
  }
}

module.exports = {
  register,
  login,
  forgotPassword,
  getAllUsers,
  getUserById,
  resetPassword,
  logout
}
