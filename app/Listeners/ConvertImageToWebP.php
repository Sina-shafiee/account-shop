<?php

namespace App\Listeners;

use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Support\Facades\Log;
use Intervention\Image\ImageManager;
use Intervention\Image\Drivers\Gd\Driver;
use Spatie\MediaLibrary\MediaCollections\Events\MediaHasBeenAddedEvent;

class ConvertImageToWebP implements ShouldQueue
{
    public function handle(MediaHasBeenAddedEvent $event): void
    {
        $media = $event->media;

        if (!str_starts_with($media->mime_type, 'image/') || $media->mime_type === 'image/webp') {
            return;
        }

        $path = $media->getPath();

        $webpPath = pathinfo($path, PATHINFO_DIRNAME) . '/' . pathinfo($path, PATHINFO_FILENAME) . '.webp';

        try {
            $manager = new ImageManager(new Driver());

            $manager->read($path)
                ->toWebp(80)
                ->save($webpPath);

            $media->file_name = pathinfo($webpPath, PATHINFO_BASENAME);
            $media->mime_type = 'image/webp';
            $media->save();

            if (file_exists($path) && file_exists($webpPath)) {
                unlink($path);
            }
        } catch (\Exception $e) {
            Log::error('Image conversion failed: ' . $e->getMessage());
        }
    }
}
