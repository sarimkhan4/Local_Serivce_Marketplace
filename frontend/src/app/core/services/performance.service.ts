import { Injectable, signal, effect, inject } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class PerformanceService {
  private router = inject(Router);
  
  // Performance metrics
  pageLoadTime = signal<number>(0);
  componentLoadTime = signal<number>(0);
  apiResponseTime = signal<number>(0);
  memoryUsage = signal<number>(0);
  activeConnections = signal<number>(0);
  
  // Performance history
  performanceHistory = signal<Array<{
    timestamp: number;
    metric: string;
    value: number;
    details?: string;
  }>>([]);

  constructor() {
    this.initializePerformanceMonitoring();
    this.trackPageLoadTimes();
    this.monitorMemoryUsage();
  }

  private initializePerformanceMonitoring() {
    // Track initial page load
    if (typeof window !== 'undefined' && 'performance' in window) {
      const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      const loadTime = navigation.loadEventEnd - navigation.fetchStart;
      this.pageLoadTime.set(loadTime);
      this.recordMetric('pageLoad', loadTime, 'Initial page load');
    }
  }

  private trackPageLoadTimes() {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      const startTime = performance.now();
      
      // Use setTimeout to measure when the page is actually rendered
      setTimeout(() => {
        const loadTime = performance.now() - startTime;
        this.pageLoadTime.set(loadTime);
        this.recordMetric('pageNavigation', loadTime, 'Route navigation');
      }, 0);
    });
  }

  private monitorMemoryUsage() {
    if (typeof window !== 'undefined' && 'performance' in window && 'memory' in performance) {
      const checkMemory = () => {
        const memory = (performance as any).memory;
        if (memory) {
          const usedMB = memory.usedJSHeapSize / 1048576;
          this.memoryUsage.set(usedMB);
          this.recordMetric('memoryUsage', usedMB, 'JS heap usage in MB');
        }
      };

      // Check memory every 5 seconds
      setInterval(checkMemory, 5000);
      checkMemory(); // Initial check
    }
  }

  startComponentTimer(componentName: string): () => void {
    const startTime = performance.now();
    
    return () => {
      const endTime = performance.now();
      const loadTime = endTime - startTime;
      this.componentLoadTime.set(loadTime);
      this.recordMetric('componentLoad', loadTime, `${componentName} component`);
    };
  }

  startApiTimer(apiCall: string): () => void {
    const startTime = performance.now();
    this.activeConnections.set(this.activeConnections() + 1);
    
    return () => {
      const endTime = performance.now();
      const responseTime = endTime - startTime;
      this.activeConnections.set(this.activeConnections() - 1);
      this.apiResponseTime.set(responseTime);
      this.recordMetric('apiResponse', responseTime, apiCall);
    };
  }

  private recordMetric(metric: string, value: number, details?: string) {
    this.performanceHistory.set([
      ...this.performanceHistory(),
      {
        timestamp: Date.now(),
        metric,
        value,
        details
      }
    ]);

    // Keep only last 100 entries
    if (this.performanceHistory().length > 100) {
      this.performanceHistory.set(this.performanceHistory().slice(-100));
    }
  }

  getPerformanceReport(): {
    averagePageLoad: number;
    averageComponentLoad: number;
    averageApiResponse: number;
    currentMemoryUsage: number;
    activeConnections: number;
    recommendations: string[];
  } {
    const history = this.performanceHistory();
    
    const pageLoads = history.filter(h => h.metric === 'pageLoad' || h.metric === 'pageNavigation');
    const componentLoads = history.filter(h => h.metric === 'componentLoad');
    const apiResponses = history.filter(h => h.metric === 'apiResponse');

    const averagePageLoad = pageLoads.length > 0 
      ? pageLoads.reduce((sum, p) => sum + p.value, 0) / pageLoads.length 
      : 0;

    const averageComponentLoad = componentLoads.length > 0 
      ? componentLoads.reduce((sum, p) => sum + p.value, 0) / componentLoads.length 
      : 0;

    const averageApiResponse = apiResponses.length > 0 
      ? apiResponses.reduce((sum, p) => sum + p.value, 0) / apiResponses.length 
      : 0;

    const recommendations = this.generateRecommendations(
      averagePageLoad, 
      averageComponentLoad, 
      averageApiResponse, 
      this.memoryUsage()
    );

    return {
      averagePageLoad,
      averageComponentLoad,
      averageApiResponse,
      currentMemoryUsage: this.memoryUsage(),
      activeConnections: this.activeConnections(),
      recommendations
    };
  }

  private generateRecommendations(
    avgPageLoad: number, 
    avgComponentLoad: number, 
    avgApiResponse: number, 
    memoryUsage: number
  ): string[] {
    const recommendations: string[] = [];

    if (avgPageLoad > 3000) {
      recommendations.push('Page load times are slow. Consider implementing lazy loading and code splitting.');
    }

    if (avgComponentLoad > 500) {
      recommendations.push('Component load times are high. Optimize component initialization and consider OnPush change detection.');
    }

    if (avgApiResponse > 2000) {
      recommendations.push('API response times are slow. Consider implementing caching and optimizing backend queries.');
    }

    if (memoryUsage > 100) {
      recommendations.push('Memory usage is high. Check for memory leaks and optimize data structures.');
    }

    if (this.activeConnections() > 10) {
      recommendations.push('Too many active connections. Implement request debouncing and connection pooling.');
    }

    if (recommendations.length === 0) {
      recommendations.push('Application performance is optimal!');
    }

    return recommendations;
  }

  clearHistory() {
    this.performanceHistory.set([]);
  }

  // Utility methods for performance optimization
  debounce<T extends (...args: any[]) => any>(
    func: T,
    wait: number
  ): (...args: Parameters<T>) => void {
    let timeout: ReturnType<typeof setTimeout>;
    return (...args: Parameters<T>) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => func(...args), wait);
    };
  }

  throttle<T extends (...args: any[]) => any>(
    func: T,
    limit: number
  ): (...args: Parameters<T>) => void {
    let inThrottle: boolean;
    return (...args: Parameters<T>) => {
      if (!inThrottle) {
        func(...args);
        inThrottle = true;
        setTimeout(() => inThrottle = false, limit);
      }
    };
  }

  // Performance monitoring for API calls
  monitorApiCall<T>(apiCall: () => Promise<T>, apiName: string): Promise<T> {
    const endTimer = this.startApiTimer(apiName);
    
    return apiCall()
      .finally(() => {
        endTimer();
      });
  }
}
