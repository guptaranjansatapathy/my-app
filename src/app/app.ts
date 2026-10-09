import { HttpClient } from '@angular/common/http';
import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  imports: [CommonModule, FormsModule],
  selector: 'app-root',
  styleUrl: './app.scss',
  templateUrl: './app.html',
})
export class App {
  constructor(private http: HttpClient){}
// Removed trailing slash to prevent double slashes in HTTP calls
  API = 'https://jsonplaceholder.typicode.com/posts';
  
  showInfodata: any[] = [];
  infoAdd: string = '';
  infoId: number = 0;

  showInfo() {
    this.http.get<any[]>(this.API).subscribe({
      next: (res) => {
        this.showInfodata = res;
      },
      error: (err) => {
        console.error('Error occurred while fetching:', err);
      }
    });
  }

  addInfo() {
    const title = this.infoAdd.trim();
    if (!title) return;

    const payLoad = { title };
    this.http.post<any>(this.API, payLoad).subscribe({
      next: (res) => {
        this.showInfodata = [...this.showInfodata, res];
        this.infoAdd = '';
      },
      error: (err) => {
        console.error('Error occurred while adding:', err);
      }
    });
  }

  getInfo(value: any) {
    this.infoId = value.id;
    this.infoAdd = value.title;
  }

  updateInfo() {
    const title = this.infoAdd.trim();
    if (!this.infoId || !title) return;

    // Send the structured object payload instead of raw string 'title'
    const payLoad = { id: this.infoId, title };

    this.http.put<any>(`${this.API}/${this.infoId}`, payLoad).subscribe({
      next: (res) => {
        // Fallback to updated payload properties if API returns incomplete payload
        const updatedItem = res.title ? res : { id: this.infoId, title };
        this.showInfodata = this.showInfodata.map((item) =>
          item.id === this.infoId ? updatedItem : item
        );
        this.infoAdd = '';
        this.infoId = 0;
      },
      error: (err) => {
        console.error('Error occurred while updating:', err);
      }
    });
  }

  deleteInfo(id: number) {
    this.http.delete(`${this.API}/${id}`).subscribe({
      next: () => {
        this.showInfodata = this.showInfodata.filter((item) => item.id !== id);
      },
      error: (err) => {
        console.error('Error occurred while deleting:', err);
      }
    });
  }

  ngOnInit(): void {
    this.showInfo();
  }
  
}
