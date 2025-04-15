import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  TextField,
  Button,
  Paper,
  Avatar,
  Grid,
  Divider,
  Alert,
  CircularProgress,
  IconButton,
} from '@mui/material';
import { PhotoCamera, Save, Cancel } from '@mui/icons-material';

const Profile = () => {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [profileImage, setProfileImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    address: '',
    bio: '',
    // Role-specific fields
    position: '',
    experience: '',
    qualifications: '',
    childrenCount: '',
    specialNeeds: '',
    emergencyContact: '',
    emergencyPhone: '',
  });

  // Simulating user data loading
  useEffect(() => {
    // Here, you'd fetch the user data from your backend
    const userData = {
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@example.com',
      phoneNumber: '123-456-7890',
      address: '1234 Main St, City, Country',
      bio: 'A little about me...',
      role: 'parent', // or 'manager', 'babysitter'
    };

    setFormData({
      firstName: userData.firstName || '',
      lastName: userData.lastName || '',
      email: userData.email || '',
      phoneNumber: userData.phoneNumber || '',
      address: userData.address || '',
      bio: userData.bio || '',
      position: userData.position || '',
      experience: userData.experience || '',
      qualifications: userData.qualifications || '',
      childrenCount: userData.childrenCount || '',
      specialNeeds: userData.specialNeeds || '',
      emergencyContact: userData.emergencyContact || '',
      emergencyPhone: userData.emergencyPhone || '',
    });

    if (userData.profileImage) {
      setPreviewUrl(userData.profileImage);
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfileImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess(false);

    try {
      // Simulate saving the profile
      // Create FormData to handle file upload
      const formDataToSend = new FormData();

      // Add all form fields
      Object.keys(formData).forEach((key) => {
        if (formData[key]) {
          formDataToSend.append(key, formData[key]);
        }
      });

      // Add profile image if selected
      if (profileImage) {
        formDataToSend.append('profileImage', profileImage);
      }

      // Simulating an updateProfile function
      console.log('Updated Profile:', formDataToSend);

      setSuccess(true);
    } catch (err) {
      setError(err.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const getRoleSpecificFields = () => {
    if (formData.role === 'parent') {
      return (
        <>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Number of Children"
              name="childrenCount"
              type="number"
              value={formData.childrenCount}
              onChange={handleChange}
              margin="normal"
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Special Needs (if any)"
              name="specialNeeds"
              value={formData.specialNeeds}
              onChange={handleChange}
              margin="normal"
              multiline
              rows={2}
            />
          </Grid>
        </>
      );
    } else if (formData.role === 'manager' || formData.role === 'babysitter') {
      return (
        <>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Position"
              name="position"
              value={formData.position}
              onChange={handleChange}
              margin="normal"
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Years of Experience"
              name="experience"
              type="number"
              value={formData.experience}
              onChange={handleChange}
              margin="normal"
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Qualifications"
              name="qualifications"
              value={formData.qualifications}
              onChange={handleChange}
              margin="normal"
              multiline
              rows={3}
            />
          </Grid>
        </>
      );
    }
    return null;
  };

  const getRoleTitle = () => {
    switch (formData.role) {
      case 'parent':
        return 'Parent Profile';
      case 'manager':
        return 'Manager Profile';
      case 'babysitter':
        return 'Babysitter Profile';
      default:
        return 'User Profile';
    }
  };

  return (
    <Container maxWidth="md">
      <Paper elevation={3} sx={{ p: 4, mt: 4, mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom align="center">
          {getRoleTitle()}
        </Typography>

        <Divider sx={{ my: 3 }} />

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        {success && (
          <Alert severity="success" sx={{ mb: 3 }}>
            Profile updated successfully!
          </Alert>
        )}

        <Box component="form" onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12} display="flex" justifyContent="center" mb={2}>
              <Box sx={{ position: 'relative' }}>
                <Avatar src={previewUrl} sx={{ width: 120, height: 120, mb: 1 }} />
                <input
                  accept="image/*"
                  style={{ display: 'none' }}
                  id="profile-image-upload"
                  type="file"
                  onChange={handleImageChange}
                />
                <label htmlFor="profile-image-upload">
                  <IconButton color="primary" component="span" sx={{ position: 'absolute', bottom: 0, right: 0 }}>
                    <PhotoCamera />
                  </IconButton>
                </label>
              </Box>
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Bio"
                name="bio"
                value={formData.bio}
                onChange={handleChange}
                margin="normal"
                multiline
                rows={4}
                placeholder="Tell us about yourself..."
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="First Name"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                margin="normal"
                required
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Last Name"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                margin="normal"
                required
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                margin="normal"
                required
                disabled
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Phone Number"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleChange}
                margin="normal"
                required
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Address"
                name="address"
                value={formData.address}
                onChange={handleChange}
                margin="normal"
                required
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Emergency Contact Name"
                name="emergencyContact"
                value={formData.emergencyContact}
                onChange={handleChange}
                margin="normal"
                required
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Emergency Contact Phone"
                name="emergencyPhone"
                value={formData.emergencyPhone}
                onChange={handleChange}
                margin="normal"
                required
              />
            </Grid>

            {getRoleSpecificFields()}

            <Grid item xs={12} display="flex" justifyContent="flex-end" gap={2} mt={2}>
              <Button variant="outlined" color="secondary" startIcon={<Cancel />} onClick={() => window.location.reload()}>
                Cancel
              </Button>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                startIcon={loading ? <CircularProgress size={20} /> : <Save />}
                disabled={loading}
              >
                Save Changes
              </Button>
            </Grid>
          </Grid>
        </Box>
      </Paper>
    </Container>
  );
};

export default Profile;
