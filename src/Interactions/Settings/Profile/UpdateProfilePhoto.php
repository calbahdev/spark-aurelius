<?php

namespace Laravel\Spark\Interactions\Settings\Profile;

use Intervention\Image\ImageManager;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;
use Laravel\Spark\Contracts\Interactions\Settings\Profile\UpdateProfilePhoto as Contract;

class UpdateProfilePhoto implements Contract
{
    /**
     * The image manager instance.
     *
     * @var \Intervention\Image\ImageManager
     */
    protected $images;

    /**
     * Create a new interaction instance.
     *
     * @param  \Intervention\Image\ImageManager  $images
     * @return void
     */
    public function __construct(ImageManager $images)
    {
        $this->images = $images;
    }

    /**
     * {@inheritdoc}
     */
    public function validator($user, array $data)
    {
        return Validator::make($data, [
            'photo' => 'required|image|max:4000',
        ]);
    }

    /**
     * {@inheritdoc}
     */
    public function handle($user, array $data)
    {
        $file = $data['photo'];

        $path = $file->hashName();

        // We will store the profile photos on the "public" disk, which is a convention
        // for where to place assets we want to be publicly accessible. Then, we can
        // grab the URL for the image to store with this user in the database row.
        $disk = Storage::disk('public');

        $disk->put("profiles/".$path, $this->formatImage($file));

        $oldPhotoUrl = $user->photo_url;

        // Next, we'll update this URL on the local user instance and save it to the DB
        // so we can access it later. Then we will delete the old photo from storage
        // since we'll no longer need to access it for this specific user profile.
	
        if ($oldPhotoUrl) {
            $disk->delete('profiles/'.$oldPhotoUrl);
        }

        $user->forceFill([
            'photo_url' => $path,
        ])->save();

    }

    /**
     * Resize an image instance for the given file.
     *
     * @param  \SplFileInfo  $file
     * @return \Intervention\Image\Image
     */
    protected function formatImage($file)
    {
        return (string) $this->images->make($file->path())
                            ->fit(300)->encode();
    }
}
