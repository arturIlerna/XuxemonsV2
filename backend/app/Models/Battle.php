<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Battle extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'friend_id',
        'user_xuxemon_id',
        'friend_xuxemon_id',
        'status', // 'pending', 'accepted', 'finished'
        'winner_id'
    ];
}
