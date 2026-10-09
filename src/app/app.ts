
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';

interface InfoItem {
  id: number;
  title: string;
  checked?: boolean;
}

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App implements OnInit {
  private readonly http = inject(HttpClient);

  readonly API = 'https://jsonplaceholder.typicode.com/posts';

  showInfodata: InfoItem[] = [];
  infoAdd = '';
  infoId = 0;

  ngOnInit(): void {
    this.showInfo();
  }

  showInfo(): void {
    this.http.get<InfoItem[]>(this.API).subscribe({
      next: (res) => {
        this.showInfodata = res;
      },
      error: (err) => {
        console.error('Error fetching data:', err);
      }
    });
  }

  addInfo(): void {
    const title = this.infoAdd.trim();
    if (!title) return;

    this.http.post<InfoItem>(this.API, { title }).subscribe({
      next: (res) => {
        this.showInfodata = [
          ...this.showInfodata,
          { ...res, checked: false }
        ];
        this.infoAdd = '';
      },
      error: (err) => {
        console.error('Error adding data:', err);
      }
    });
  }

  getInfo(item: InfoItem): void {
    this.infoId = item.id;
    this.infoAdd = item.title;
  }

  updateInfo(): void {
    const title = this.infoAdd.trim();
    if (!this.infoId || !title) return;

    const id = this.infoId;

    this.http.put<InfoItem>(`${this.API}/${id}`, {
      id,
      title
    }).subscribe({
      next: (res) => {
        this.showInfodata = this.showInfodata.map(item =>
          item.id === id
            ? { ...item, title: res?.title ?? title }
            : item
        );

        this.infoAdd = '';
        this.infoId = 0;
      },
      error: (err) => {
        console.error('Error updating data:', err);
      }
    });
  }

  deleteInfo(id: number): void {
    this.http.delete(`${this.API}/${id}`).subscribe({
      next: () => {
        this.showInfodata = this.showInfodata.filter(
          item => item.id !== id
        );
      },
      error: (err) => {
        console.error('Error deleting data:', err);
      }
    });
  }
}