import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UserService } from '../../services/user.service';
import { User } from '../../models/user';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule
  ],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  user: User | null = null;
  isLoading = true;
  isEditing = false;
  editedUser: Partial<User> = {};

  constructor(
    private userService: UserService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loadUserProfile();
  }

  loadUserProfile(): void {
    this.isLoading = true;
    this.userService.getCurrentUser().subscribe({
      next: (user) => {
        this.user = user;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading user profile', error);
        this.isLoading = false;
        this.snackBar.open('Failed to load profile. Please try again later.', 'Close', {
          duration: 5000
        });
      }
    });
  }

  startEditing(): void {
    if (this.user) {
      this.editedUser = { ...this.user };
      this.isEditing = true;
    }
  }

  cancelEditing(): void {
    this.isEditing = false;
    this.editedUser = {};
  }

  saveProfile(): void {
    if (!this.editedUser) return;

    this.isLoading = true;

    // Check if email has been changed
    const emailChanged = this.user?.email !== this.editedUser.email && this.editedUser.email;

    // If email has changed, update it separately
    if (emailChanged) {
      const emailToUpdate = this.editedUser.email as string;
      const userData = { ...this.editedUser };
      delete userData.email; // Remove email from the main update

      // First update other fields
      this.userService.updateUser(userData).subscribe({
        next: (updatedUser) => {
          // Then update email separately
          this.userService.updateEmail(emailToUpdate).subscribe({
            next: (userWithUpdatedEmail) => {
              this.user = userWithUpdatedEmail;
              this.isEditing = false;
              this.isLoading = false;
              this.snackBar.open('Profile updated successfully!', 'Close', {
                duration: 3000
              });
            },
            error: (error) => {
              console.error('Error updating email', error);
              this.isLoading = false;
              this.snackBar.open('Failed to update email. Please try again.', 'Close', {
                duration: 5000
              });
            }
          });
        },
        error: (error) => {
          console.error('Error updating profile', error);
          this.isLoading = false;
          this.snackBar.open('Failed to update profile. Please try again.', 'Close', {
            duration: 5000
          });
        }
      });
    } else {
      // No email change, update normally
      this.userService.updateUser(this.editedUser).subscribe({
        next: (updatedUser) => {
          this.user = updatedUser;
          this.isEditing = false;
          this.isLoading = false;
          this.snackBar.open('Profile updated successfully!', 'Close', {
            duration: 3000
          });
        },
        error: (error) => {
          console.error('Error updating profile', error);
          this.isLoading = false;
          this.snackBar.open('Failed to update profile. Please try again.', 'Close', {
            duration: 5000
          });
        }
      });
    }
  }
}
