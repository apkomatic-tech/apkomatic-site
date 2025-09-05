/**
 * Performance monitoring and optimization utilities for the blog system
 */

import { dev } from '$app/environment';

/**
 * Performance timer for measuring operation duration
 */
export class PerformanceTimer {
	private startTime: number;
	private label: string;

	constructor(label: string) {
		this.label = label;
		this.startTime = performance.now();
	}

	/**
	 * End the timer and log the duration
	 * @returns Duration in milliseconds
	 */
	end(): number {
		const duration = performance.now() - this.startTime;

		if (dev) {
			console.log(`⏱️  ${this.label}: ${duration.toFixed(2)}ms`);
		}

		return duration;
	}
}

/**
 * Measure the performance of an async operation
 * @param label - Label for the operation
 * @param operation - The async operation to measure
 * @returns The result of the operation
 */
export async function measureAsync<T>(label: string, operation: () => Promise<T>): Promise<T> {
	const timer = new PerformanceTimer(label);
	try {
		const result = await operation();
		timer.end();
		return result;
	} catch (error) {
		timer.end();
		throw error;
	}
}

/**
 * Measure the performance of a synchronous operation
 * @param label - Label for the operation
 * @param operation - The operation to measure
 * @returns The result of the operation
 */
export function measureSync<T>(label: string, operation: () => T): T {
	const timer = new PerformanceTimer(label);
	try {
		const result = operation();
		timer.end();
		return result;
	} catch (error) {
		timer.end();
		throw error;
	}
}

/**
 * Blog performance metrics
 */
export interface BlogPerformanceMetrics {
	totalPosts: number;
	loadTime: number;
	cacheHits: number;
	cacheMisses: number;
	averageProcessingTime: number;
}

/**
 * Performance metrics collector
 */
class PerformanceMetrics {
	private metrics: Map<string, number[]> = new Map();
	private counters: Map<string, number> = new Map();

	/**
	 * Record a timing metric
	 * @param key - The metric key
	 * @param value - The timing value in milliseconds
	 */
	recordTiming(key: string, value: number): void {
		if (!this.metrics.has(key)) {
			this.metrics.set(key, []);
		}
		this.metrics.get(key)!.push(value);
	}

	/**
	 * Increment a counter metric
	 * @param key - The counter key
	 */
	incrementCounter(key: string): void {
		const current = this.counters.get(key) || 0;
		this.counters.set(key, current + 1);
	}

	/**
	 * Get average timing for a metric
	 * @param key - The metric key
	 * @returns Average timing or 0 if no data
	 */
	getAverageTiming(key: string): number {
		const timings = this.metrics.get(key);
		if (!timings || timings.length === 0) return 0;

		const sum = timings.reduce((a, b) => a + b, 0);
		return sum / timings.length;
	}

	/**
	 * Get counter value
	 * @param key - The counter key
	 * @returns Counter value or 0 if not found
	 */
	getCounter(key: string): number {
		return this.counters.get(key) || 0;
	}

	/**
	 * Get blog performance summary
	 * @returns Performance metrics summary
	 */
	getBlogMetrics(): BlogPerformanceMetrics {
		return {
			totalPosts: this.getCounter('posts_loaded'),
			loadTime: this.getAverageTiming('blog_load_time'),
			cacheHits: this.getCounter('cache_hits'),
			cacheMisses: this.getCounter('cache_misses'),
			averageProcessingTime: this.getAverageTiming('markdown_processing')
		};
	}

	/**
	 * Reset all metrics
	 */
	reset(): void {
		this.metrics.clear();
		this.counters.clear();
	}

	/**
	 * Log performance summary (development only)
	 */
	logSummary(): void {
		if (!dev) return;

		const metrics = this.getBlogMetrics();
		console.log('📊 Blog Performance Metrics:');
		console.log(`   Posts loaded: ${metrics.totalPosts}`);
		console.log(`   Average load time: ${metrics.loadTime.toFixed(2)}ms`);
		console.log(`   Cache hits: ${metrics.cacheHits}`);
		console.log(`   Cache misses: ${metrics.cacheMisses}`);
		console.log(`   Average processing time: ${metrics.averageProcessingTime.toFixed(2)}ms`);

		if (metrics.cacheHits + metrics.cacheMisses > 0) {
			const hitRate = (metrics.cacheHits / (metrics.cacheHits + metrics.cacheMisses)) * 100;
			console.log(`   Cache hit rate: ${hitRate.toFixed(1)}%`);
		}
	}
}

// Global performance metrics instance
export const blogMetrics = new PerformanceMetrics();

/**
 * Optimize blog post data for serialization
 * @param posts - Array of blog posts
 * @returns Optimized posts for client-side use
 */
export function optimizePostsForSerialization(posts: any[]): any[] {
	return posts.map((post) => ({
		...post,
		// Remove raw content from client-side data to reduce bundle size
		rawContent: undefined,
		// Ensure dates are serializable
		date: post.date instanceof Date ? post.date.toISOString() : post.date
	}));
}
