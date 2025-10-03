/**
 * Newsletter Subscriber Storage
 * Simple JSON-based storage for newsletter subscribers
 */

import { promises as fs } from 'fs';
import { join } from 'path';
import crypto from 'crypto';

export interface NewsletterSubscriber {
  id: string;
  email: string;
  name?: string;
  subscribedAt: string;
  isActive: boolean;
  unsubscribeToken: string;
}

const STORAGE_FILE = join(process.cwd(), 'data', 'newsletter-subscribers.json');

/**
 * Ensure data directory exists
 */
async function ensureDataDirectory(): Promise<void> {
  const dataDir = join(process.cwd(), 'data');
  try {
    await fs.access(dataDir);
  } catch {
    await fs.mkdir(dataDir, { recursive: true });
  }
}

/**
 * Read subscribers from storage
 */
export async function getSubscribers(): Promise<NewsletterSubscriber[]> {
  try {
    await ensureDataDirectory();
    const data = await fs.readFile(STORAGE_FILE, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    // File doesn't exist or is invalid, return empty array
    return [];
  }
}

/**
 * Write subscribers to storage
 */
export async function saveSubscribers(subscribers: NewsletterSubscriber[]): Promise<void> {
  await ensureDataDirectory();
  await fs.writeFile(STORAGE_FILE, JSON.stringify(subscribers, null, 2), 'utf-8');
}

/**
 * Add a new subscriber
 */
export async function addSubscriber(email: string, name?: string): Promise<NewsletterSubscriber> {
  const subscribers = await getSubscribers();
  
  // Check if email already exists
  const existingSubscriber = subscribers.find(sub => sub.email.toLowerCase() === email.toLowerCase());
  if (existingSubscriber) {
    if (existingSubscriber.isActive) {
      throw new Error('Email is already subscribed');
    } else {
      // Reactivate existing subscriber
      existingSubscriber.isActive = true;
      existingSubscriber.subscribedAt = new Date().toISOString();
      existingSubscriber.name = name || existingSubscriber.name;
      await saveSubscribers(subscribers);
      return existingSubscriber;
    }
  }
  
  // Create new subscriber
  const newSubscriber: NewsletterSubscriber = {
    id: crypto.randomUUID(),
    email: email.toLowerCase(),
    name,
    subscribedAt: new Date().toISOString(),
    isActive: true,
    unsubscribeToken: crypto.randomBytes(32).toString('hex'),
  };
  
  subscribers.push(newSubscriber);
  await saveSubscribers(subscribers);
  
  return newSubscriber;
}

/**
 * Remove a subscriber by email
 */
export async function removeSubscriber(email: string): Promise<boolean> {
  const subscribers = await getSubscribers();
  const subscriberIndex = subscribers.findIndex(sub => sub.email.toLowerCase() === email.toLowerCase());
  
  if (subscriberIndex === -1) {
    return false;
  }
  
  subscribers[subscriberIndex].isActive = false;
  await saveSubscribers(subscribers);
  
  return true;
}

/**
 * Find subscriber by unsubscribe token
 */
export async function findSubscriberByToken(token: string): Promise<NewsletterSubscriber | null> {
  const subscribers = await getSubscribers();
  return subscribers.find(sub => sub.unsubscribeToken === token && sub.isActive) || null;
}

/**
 * Unsubscribe using token
 */
export async function unsubscribeByToken(token: string): Promise<NewsletterSubscriber | null> {
  const subscriber = await findSubscriberByToken(token);
  if (!subscriber) {
    return null;
  }
  
  await removeSubscriber(subscriber.email);
  return subscriber;
}

/**
 * Get active subscribers count
 */
export async function getActiveSubscribersCount(): Promise<number> {
  const subscribers = await getSubscribers();
  return subscribers.filter(sub => sub.isActive).length;
}

/**
 * Get all active subscribers
 */
export async function getActiveSubscribers(): Promise<NewsletterSubscriber[]> {
  const subscribers = await getSubscribers();
  return subscribers.filter(sub => sub.isActive);
}
