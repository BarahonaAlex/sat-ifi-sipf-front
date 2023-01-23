import { ThemePalette } from "@angular/material/core";
import { FormStructure } from 'mat-dynamic-form';

export interface DialogOptions {
    title?: string;
    text?: string;
    icon?: DialogIcon;
    showConfirmButton?: boolean;
    showSecondaryButton?: boolean;
    showCancelButton?: boolean;
    showCloseButton?: boolean;
    confirmButtonColor?: ThemePalette;
    secondaryButtonColor?: ThemePalette;
    cancelButtonColor?: ThemePalette;
    closeButtonColor?: ThemePalette;
    confirmButtonText?: string;
    secondaryButtonText?: string;
    cancelButtonText?: string;
    disableClose?: boolean;
    formStructure?: FormStructure;
    width?: string;
    height?: string;
    maxWidth?: string;
    maxHeight?: string;
}

export interface SnackBarOptions {
    title?: string;
    text?: string;
    icon?: DialogIcon;
    duration: number;
    action?: string;
    showCloseButton?: boolean;
    closeButtonColor?: ThemePalette;
}

export type DialogIcon = 'success' | 'error' | 'warning' | 'info' | 'question' | 'loading';

export type DialogResult = "primary" | "secondary" | "cancel";