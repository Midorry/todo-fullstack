import { Component, OnInit } from '@angular/core';
import { Todo } from 'src/app/model/todo.model';
import { ToDoService } from 'src/app/services/todo.service';
import { NotificationService } from 'src/app/services/notification.service';
import { take, filter } from 'rxjs';

@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.scss'],
})
export class WelcomeComponent implements OnInit {
  userEmail: string | null = null;

  showAdd = false;
  totalTodos: number = 0;
  completedTodos: number = 0;
  overdueTodos: number = 0;
  upcomingTodos: number = 0;
  progressPercent: number = 0;

  topImportantTodos: Todo[] = [];

  randomQuote: string = '';

  // Danh sách câu quote để random
  quotes: string[] = [
    'Mỗi ngày là một cơ hội mới!',
    'Hoàn thành từng việc nhỏ để tạo nên thành công lớn!',
    'Hãy làm hết sức, kết quả sẽ đến!',
    'Đừng trì hoãn, hãy bắt đầu ngay hôm nay!',
    'Cố gắng thêm một chút mỗi ngày!',
  ];

  constructor(
    private todoService: ToDoService,
    private notification: NotificationService
  ) {}

  ngOnInit(): void {
    // Lấy email để hiển thị lời chào
    const userEmailString = localStorage.getItem('userTodo');
    if (userEmailString !== null) {
      this.userEmail = JSON.parse(userEmailString).userName;
    }

    // Random một câu quote mỗi lần load trang
    this.randomQuote = this.getRandomQuote();

    // Gọi loadTodos từ service
    this.todoService.loadTodos();

    // Subscribe để cập nhật thống kê liên tục
    this.todoService.todos$.subscribe((todos) => {
      this.updateStats(todos);
    });

    // Thông báo khi login (chỉ 1 lần)
    const hasShown = localStorage.getItem('hasShownWelcomeNotification');
    if (hasShown !== 'true') {
      this.todoService.todos$
        .pipe(
          filter((todos) => todos.length > 0),
          take(1)
        )
        .subscribe((todos) => {
          this.checkAndNotify(todos);
          localStorage.setItem('hasShownWelcomeNotification', 'true');
        });
    }
  }

  /**
   * Lấy random một câu quote
   */
  getRandomQuote(): string {
    const index = Math.floor(Math.random() * this.quotes.length);
    return this.quotes[index];
  }

  /**
   * Hiển thị modal thêm mới công việc
   */
  onAdd(): void {
    this.showAdd = true;
  }

  onCancelAdd() {
    this.showAdd = false;
  }

  /**
   * Chuyển sang trang lịch (có thể điều hướng)
   */
  viewCalendar(): void {
    console.log('Đi tới trang lịch');
    // Ví dụ: this.router.navigate(['/calendar']);
  }

  /**
   * Chuyển sang trang thống kê
   */
  viewStats(): void {
    console.log('Đi tới trang thống kê');
    // Ví dụ: this.router.navigate(['/stats']);
  }

  /**
   * Cập nhật thống kê số liệu
   */
  updateStats(todos: Todo[]) {
    this.totalTodos = todos.length;
    this.completedTodos = todos.filter((todo) => todo.completed).length;

    const now = new Date();
    this.overdueTodos = todos.filter(
      (todo) => new Date(todo.deadline).getTime() < now.getTime()
    ).length;

    // Trong 7 ngày tới
    const sevenDaysLater = new Date();
    sevenDaysLater.setDate(now.getDate() + 7);
    this.upcomingTodos = todos.filter((todo) => {
      const deadlineDate = new Date(todo.deadline);
      return deadlineDate > now && deadlineDate <= sevenDaysLater;
    }).length;

    // Tính progress
    if (this.totalTodos > 0) {
      this.progressPercent = Math.round(
        (this.completedTodos / this.totalTodos) * 100
      );
    } else {
      this.progressPercent = 0;
    }

    // Top 3 công việc priority cao nhất
    this.topImportantTodos = todos
      .filter((todo) => todo.priority === 'high')
      .sort(
        (a, b) =>
          new Date(a.deadline).getTime() - new Date(b.deadline).getTime()
      )
      .slice(0, 3);
  }

  /**
   * Thông báo khi login
   */
  checkAndNotify(todos: Todo[]) {
    const now = new Date();
    const sevenDaysLater = new Date();
    sevenDaysLater.setDate(now.getDate() + 7);

    const countOverdue = todos.filter(
      (todo) => new Date(todo.deadline).getTime() < now.getTime()
    ).length;

    const countUpcoming = todos.filter((todo) => {
      const deadlineDate = new Date(todo.deadline);
      return deadlineDate > now && deadlineDate <= sevenDaysLater;
    }).length;

    if (countOverdue > 0) {
      this.notification.show(
        `Có ${countOverdue} công việc đã quá hạn`,
        'error'
      );
    }
    if (countUpcoming > 0) {
      this.notification.show(
        `Có ${countUpcoming} công việc gần đến hạn`,
        'warning'
      );
    }
  }
}
