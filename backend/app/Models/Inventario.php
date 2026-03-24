<?php

namespace App\Models;
use Illuminate\Database\Eloquent\Model;

class Inventario extends Model
{
    protected $table = 'inventario';
    protected $fillable = ['user_id', 'xuxemon_id', 'cantidad'];
    
    public function user()
    {
        return $this->belongsTo(User::class);
    }
    
    public function xuxemon()
    {
        return $this->belongsTo(Xuxemon::class);
    }
}