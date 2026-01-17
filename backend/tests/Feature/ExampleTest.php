<?php

namespace Tests\Feature;

// use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ExampleTest extends TestCase
{
    /**
     * A basic test example.
     */
    #[Test]
    public function test_api_is_loaded()
    {
        $this->get('/api/_test')->assertOk();
    }

}
