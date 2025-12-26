import { Component, forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

interface SelectedFile {
  file: File | null;
  name: string;
  preview: string | null;
  base64: string;
  file_type: string;
}

@Component({
  selector: 'app-import-multi-file',
  templateUrl: './import-multi-file.component.html',
  styleUrls: ['./import-multi-file.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => ImportMultiFileComponent),
      multi: true,
    },
  ],
})
export class ImportMultiFileComponent implements ControlValueAccessor {
  onChange = (_: any) => {};
  onTouched = () => {};

  files: File[] = [];

  // Lógica para manejar la selección de archivos
  onFilesSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    const newFiles = Array.from(input.files || []);

    // Combina los archivos existentes con los nuevos, sin duplicados.
    const combinedFiles = [...this.files, ...newFiles];

    // Filtrar duplicados por nombre y tamaño para evitar archivos repetidos.
    const uniqueFiles = combinedFiles.filter(
      (file, index, self) =>
        index ===
        self.findIndex(f => f.name === file.name && f.size === file.size)
    );

    this.files = uniqueFiles;

    // Limpiar el valor del input para permitir que el mismo archivo se pueda seleccionar de nuevo
    input.value = '';

    console.log(this.files);

    // Notificar a Reactive Forms del cambio en el valor
    this.onChange(this.files);
  }

  removeFile(index: number) {
    // Elimina 1 elemento en la posición del índice.
    this.files.splice(index, 1);

    // Notifica a Reactive Forms del cambio en el valor.
    this.onChange(this.files);
  }

  // Métodos de ControlValueAccessor
  writeValue(files: File[]): void {
    // Implementa la lógica si necesitas pre-poblar el campo (opcional)
    this.files = files;
  }

  registerOnChange(fn: (files: File[]) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState?(isDisabled: boolean): void {
    // Lógica para deshabilitar o habilitar el componente
  }
}
