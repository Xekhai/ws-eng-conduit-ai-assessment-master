import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { UserService } from '@realworld/core/user/user.service';
import { User } from '@realworld/core/user/user.model';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';  // Import HttpClient
import { forkJoin } from 'rxjs';  // Import forkJoin

@Component({
  selector: 'app-roster',
  standalone: true,
  imports:[CommonModule],
  templateUrl: './roster.component.html',
  styleUrls: ['./roster.component.css']
})
export class RosterComponent implements OnInit {
  users: User[] = [];
  usersWithStats: any[] = [];
  isLoading = true;

  constructor(private userService: UserService, private http: HttpClient, private cdRef: ChangeDetectorRef) {}

  ngOnInit(): void {
    forkJoin({
      users: this.userService.getAllUsers(),
      articles: this.http.get<any>('http://localhost:3000/api/articles')  // Replace with your actual endpoint
    }).subscribe(({ users, articles }) => {
      this.users = users;
      this.processData(users, articles.articles);
      this.isLoading = false;
      console.log(this.users);
      this.cdRef.detectChanges();
    });
  }

  private processData(usersArray: any[], articles: any[]) {
    const userStats: any = {};
  
    articles.forEach(article => {
      const authorId = article.author.id;
  
      if (!userStats[authorId]) {
        userStats[authorId] = {
          totalArticles: 0,
          totalLikes: 0,
          firstArticleDate: new Date(article.createdAt)
        };
      }
  
      userStats[authorId].totalArticles += 1;
      userStats[authorId].totalLikes += article.favoritesCount;
  
      if (new Date(article.createdAt) < userStats[authorId].firstArticleDate) {
        userStats[authorId].firstArticleDate = new Date(article.createdAt);
      }
    });
  
    this.usersWithStats = usersArray.map(userObj => {
      const user = userObj.user;  // Access the nested user object
      const stats = userStats[user.id] || {};
  
      return {
        ...user,  // Spread the nested user properties
        totalArticles: stats.totalArticles || 0,
        totalLikes: stats.totalLikes || 0,
        firstArticleDate: stats.firstArticleDate || null
      };
    });
  
    this.usersWithStats.sort((a, b) => b.totalLikes - a.totalLikes);
  }
  
}
