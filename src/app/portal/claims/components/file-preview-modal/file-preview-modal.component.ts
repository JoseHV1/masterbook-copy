import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { SafeResourceUrl, DomSanitizer } from '@angular/platform-browser';
import {
  FilePreviewDataItemModel,
  FilePreviewDataModel,
} from 'src/app/shared/interfaces/models/file-preview-data-item.model';

@Component({
  selector: 'app-file-preview-modal',
  templateUrl: './file-preview-modal.component.html',
  styleUrls: ['./file-preview-modal.component.scss'],
})
export class FilePreviewModalComponent implements OnInit {
  activeIndex = 0;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: FilePreviewDataModel,
    public dialogRef: MatDialogRef<FilePreviewModalComponent>,
    private sanitizer: DomSanitizer
  ) {}

  ngOnInit(): void {
    this.activeIndex = this.data.selectedIndex;
  }

  get currentItem(): FilePreviewDataItemModel {
    const file = this.data.files[this.activeIndex];
    return {
      ...file,
      preview: file.preview,
    };
  }

  get sanitizedPreview(): SafeResourceUrl | null {
    const fileType = this.currentItem?.extension?.toLowerCase();

    if (fileType === 'pdf' && this.currentItem?.document) {
      return this.sanitizer.bypassSecurityTrustResourceUrl(
        this.currentItem.document
      );
    }

    return null;
  }

  next() {
    if (this.activeIndex < this.data.files.length - 1) {
      this.activeIndex++;
    }
  }

  prev() {
    if (this.activeIndex > 0) {
      this.activeIndex--;
    }
  }

  goTo(index: number) {
    this.activeIndex = index;
  }

  download(): void {
    const item = this.currentItem;
    const link = document.createElement('a');
    link.href = item.preview ?? '';
    link.download = item.name;
    link.target = '_blank';
    link.click();
  }

  close(): void {
    this.dialogRef.close();
  }
}
